from django.shortcuts import render
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from .serializers import (
    SearchByPhoneSerializer,
    SearchByIdSerializer,
    ApplyListFromMeSerializer,
    friendTotalInfoSerializer,
)
from accounts.models import Profile

from friend.models import FriendApplyList, FriendList


# Create your views here.

User = get_user_model()


class FriendListView(APIView):
    pass

# 친구 검색
class SearchByPhone(APIView):
    def get(self, request, phone):
        print(phone)
        user = User.objects.filter(phone_number=phone)
        print(user)
        serializer = SearchByPhoneSerializer(user, many=True)
        return Response(serializer.data, status=201)

# 친구 검색
class SearchById(APIView):
    def get(self, request, id):
        print("== SearchById == ")
        print(id)
        user = User.objects.filter(name__icontains=id)
        print(user)
        result = []

        # 내가 요청한 친구 리스트
        f1 = FriendApplyList.objects.filter(userFrom=request.user.id)
        # 내 친구 리스트
        mf = FriendList.objects.filter(userFrom=request.user.id)
        # 나를 요청한 친구 리스트
        fm = FriendApplyList.objects.filter(userTo=request.user, userFrom="20")
        print("==fm==")
        print(fm)
        # f1_exist = f1.exists()
        for userInfo in user:
            userId = userInfo.id
            print(f1)
            # 이미 요청 중인 상황이라면

            checkDate = None
            if f1.exists() == True:
                checkDate = f1[0].userTo.all().filter(pk=userId).exists()
            else:
                checkDate = False

            checkDate1 = None
            if mf.exists() == True:
                checkDate1 = mf[0].friend.all().filter(pk=userId).exists()
            else:
                checkDate1 = False

            checkDate2 = None
            if fm.exists() == True:
                checkDate2 = FriendApplyList.objects.filter(
                    userTo=request.user, userFrom=str(userId)
                ).exists()
            else:
                checkDate2 = False

            if checkDate or checkDate1 or checkDate2:
                pass
            else:

                serializer = SearchByIdSerializer(userInfo)
                result.append(serializer.data)

        return Response(result, status=201)

# 요청 목록
class ApplyById(APIView):
    def post(self, request):
        print(request.data)
        print(request.user.pk)
        friendId = request.data["friend"]
        myId = request.user.pk
        friendUser = User.objects.get(id=friendId)

        # checkDb = FriendApplyList.objects.filter(userFrom=myId)
        # checkDb1 = checkDb.userTo.all().filter(userTo=friendId)

        # print(checkDb1)
        # many 생성
        f1 = FriendApplyList.objects.get_or_create(userFrom=myId)[0]
        print(f1)
        f1.userTo.add(friendUser)
        # manyTomany 추가

        data = f1.userTo.all().filter(id=friendId)
        print("=====data======")
        print(data)

        serializer = ApplyListFromMeSerializer(data, many=True)
        return Response(serializer.data, status=201)

# 요청 취소
class ApplyCancelById(APIView):
    def post(self, request):
        print(request.data)
        print(request.user.pk)
        friendId = request.data["friend"]
        myId = request.user.pk
        friendUser = User.objects.get(id=friendId)

        # checkDb = FriendApplyList.objects.filter(userFrom=myId)
        # checkDb1 = checkDb.userTo.all().filter(userTo=friendId)

        # print(checkDb1)
        # many 생성
        f1 = FriendApplyList.objects.get(userFrom=myId)

        f1.userTo.remove(friendUser)
        # manyTomany 추가

        return Response([], status=201)

# 전체 친구목록
class FriendTotlaInfo(APIView):
    def get(self, request):
        print(request.user.pk)
        myId = request.user.pk

        # 1. 내가 친추건 모든 친구
        print("1단계")
        checkAF = FriendApplyList.objects.filter(userFrom=myId).exists()

        applyFriendS = None
        allAf1 = None
        if checkAF:
            af1 = FriendApplyList.objects.get(userFrom=myId)
            allAf1 = af1.userTo.all()

        applyFriendS = friendTotalInfoSerializer(allAf1, many=True)
        print(applyFriendS.data)

        # 2. 나를 친추 신청한 친구
        print("2단계")
        bf1 = FriendApplyList.objects.filter(userTo=request.user).values("userFrom")

        appliedFriend = []
        for usrId in bf1:
            userId = int(usrId["userFrom"])
            print(userId)

            user = User.objects.get(id=userId)
            appliedFriend.append(user)

        appliedFriendS = friendTotalInfoSerializer(appliedFriend, many=True)
        print(appliedFriendS.data)

        # 내 친구 목록
        print("3단계")
        checkMF = FriendList.objects.filter(userFrom=myId).exists()
        mf1FriendS = None
        mf1 = None
        if checkMF:
            me = User.objects.get(pk=myId)
            mf = FriendList.objects.get(userFrom=me)
            # 1. 내가 친추건 모든 친구
            mf1 = mf.friend.all()

        mf1FriendS = friendTotalInfoSerializer(mf1, many=True)

        return Response(
            {
                "applyFriendS": applyFriendS.data,
                "appliedFriendS": appliedFriendS.data,
                "myFriend": mf1FriendS.data,
            },
            status=201,
        )


# 친구 거절
class AppliedReject(APIView):
    def post(self, request):
        print(request.data)

        friendId = request.data["friend"]

        appliedFriend = FriendApplyList.objects.get(userFrom=friendId)

        appliedFriend.userTo.remove(request.user)

        return Response([], status=201)


# 친구 승인
class AppliedAgree(APIView):
    def post(self, request):
        print(request.data)

        friendId = request.data["friend"]
        # 신청 삭제
        appliedFriend = FriendApplyList.objects.get(userFrom=friendId)

        appliedFriend.userTo.remove(request.user)

        myId = request.user.id

        friendUser = User.objects.get(pk=friendId)
        print(friendId)

        # 내 입장
        me = User.objects.get(pk=myId)
        print("1")
        my = FriendList.objects.get_or_create(userFrom=me)[0]
        print("2")
        my.friend.add(friendUser)
        print("3")
        # 친구 입장
        fr = User.objects.get(pk=friendId)
        friend = FriendList.objects.get_or_create(userFrom=fr)[0]
        friend.friend.add(request.user)

        newFriend = friendTotalInfoSerializer(friendUser)

        return Response(newFriend.data, status=201)


# 친구 삭제
class FriendDelete(APIView):
    def post(self, request):
        print(request.data)

        friendId = request.data["friend"]
        myId = request.user.id

        friendUser = User.objects.get(pk=friendId)
        print(friendId)

        # 내 입장에서 삭제
        me = User.objects.get(pk=myId)
        my = FriendList.objects.get_or_create(userFrom=me)[0]
        my.friend.remove(friendUser)

        # 친구 입장에서도 삭제
        fr = User.objects.get(pk=friendId)
        friend = FriendList.objects.get_or_create(userFrom=fr)[0]
        friend.friend.remove(request.user)

        return Response([], status=201)
