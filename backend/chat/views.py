from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import ChattingSerializer
from .models import Chatting

# 채팅
class ChattingView(APIView):
    # 채팅 입력시 저장
    def post(self, request):
        data = request.data

        data["userId"] = request.user.id

        serializer = ChattingSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    # 해당 방에 대한 채팅 가져오기, 
    # planId : 현재 여행 방
    # step : 채팅방 스크롤 올릴 떄마다 다음 채팅 30 가져오기
    def get(self, request, planId, step):

        print("===채팅데이터===")
        # message: "1"
        # planNo: "31"
        # userImg: "http://localhost:8000/media/public/basic.JPG"
        # userName: "하동투"
        #     qs = Contract.objects.values_list(
        # 'contractor__name', 'location', 'amount')
        chatting = (
            Chatting.objects.filter(planNo=planId)
            .select_related("user")
            .select_related("user__profile")[(30 * (step - 1)) : (30 * step)]
        )
        # [:20]
        print(chatting.query)

        print(chatting.values())
        qs = chatting.values(
            "pk", "message", "planNo", "user__name", "user__profile__avatar"
        )

        # 채팅에 보여줄 obj를 담기
        chattingList = []
        ## 역순으로 취득
        for row in reversed(qs):
            obj = {}
            pk = row["pk"]
            message = row["message"]
            planNo = row["planNo"]
            userImg = "http://localhost:8000/media/" + row["user__profile__avatar"]
            userName = row["user__name"]
            obj["pk"] = pk
            obj["message"] = message
            obj["planNo"] = planNo
            obj["userImg"] = userImg
            obj["userName"] = userName
            chattingList.append(obj)
        print("==chattingList==")
        print(chattingList)
       
        return Response(chattingList, status=201)
