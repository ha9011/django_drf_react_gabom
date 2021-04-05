from django.shortcuts import render
from django.db.models import Q, Avg, Count
from datetime import date, timedelta
from django.db import transaction
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from accounts.models import Profile
from rest_framework.decorators import api_view, permission_classes
from .serializers import (
    MakePlanSerializer,
    PlanListSerializer,
    DetailDatePlanSerializer,
    PlanChoiceSerializer,
    LoginUserInfoSerializer,
    PlanMemberSerializer,
    FriendInfoSerializer,
    NoMemberFriendInfoSerializer,
    GetChattingSerializer,
    PlanListInfoSerializer,
    SharePlanListInfoSerializer,
    ShareAvgScorePlanInfoSerializer,
    SharePlanInfoSerializer,
)
from .models import (
    Plan,
    PlanDate,
    DetailPlan,
    PlanMember,
    PlanRejectReaSon,
    SharePlan,
    SharePlanDate,
    ShareDetail,
    ShareScore,
)
from .pdate import getSiGunGuCodeData, getPlaceData, getPlaceId
from chat.models import Chatting
from houses.models import HouseReservationBoard

User = get_user_model()

# 여행 계획 만들기
class MakePlanView(APIView):
    def post(self, request):
        print("여행계획 post")
        formData = request.data
        print(formData)
        print(request.user.pk)

        serializer = MakePlanSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            serializer.save(pk=request.user.pk)
            print("==여행 완성==")
            print(serializer.data)

            return Response({"plan": serializer.data}, status=201)
        return Response(serializer.errors, status=400)

    def get(self, request):
        print("여행계획 리스트")
        print(request.user.pk)
        # user = User.objects.get(pk=request.user.pk)
        # 나도 포함된 여행계획
        myPlanMember = PlanMember.objects.filter(user=request.user.pk, complete="1")

        serializer1 = PlanListSerializer(myPlanMember, many=True)
        print(serializer1.data)

        # 초대받은 여행계획
        invitedPlanMember = PlanMember.objects.filter(
            user=request.user.pk, complete="0"
        )

        serializer2 = PlanListSerializer(invitedPlanMember, many=True)
        return Response(
            {"myPlan": serializer1.data, "invitedPlan": serializer2.data}, status=201
        )


# 신청할 계획 플랜
class WillApplyPlanView(APIView):
    def put(self, request):
        print("여행계획 update")
        planId = request.data["planId"]

        myPlanList = Plan.objects.get(user=request.user.pk, pk=planId, share=0)

        # 신청시 1번 상태로
        myPlanList.share = 1

        myPlanList.save()

        serializer1 = PlanListInfoSerializer(myPlanList)
        print(serializer1.data)

        return Response({"myPlan": serializer1.data}, status=201)

    def get(self, request):
        print("여행계획 리스트")
        print(request.user.pk)
        # user = User.objects.get(pk=request.user.pk)
        # 내가 만든 여행계획 리스트 중, 아직 공유신청 안한 계획
        myPlanList = Plan.objects.filter(user=request.user.pk, share=0)

        serializer1 = PlanListInfoSerializer(myPlanList, many=True)

        return Response({"myPlan": serializer1.data}, status=201)


# 계획자 입장에서, 심사중  거절 다 초기화 하기
class CancelApplyPlanView(APIView):
    def put(self, request):
        print("여행계획 update")
        planId = request.data["planId"]
        shareType = request.data["shareType"]

        myPlanList = Plan.objects.get(user=request.user.pk, pk=planId)

        # 초기화
        myPlanList.share = 0

        myPlanList.save()

        serializer1 = PlanListInfoSerializer(myPlanList)

        if shareType == 2:
            print("share 부분 삭제")
            SharePlan.objects.filter(plan=planId).delete()

        return Response({"myPlan": serializer1.data}, status=201)


# 공유중인, 공유 신청 중인 리스트
class ApplyPlanView(APIView):
    def put(self, request):
        pass

    def get(self, request):
        print("공유계획 심사중 혹은 승인 리스트")
        print(request.user.pk)
        # user = User.objects.get(pk=request.user.pk)
        # share 1,2   // 1 : 심사중, 2:승인, 3:거절

        myPlanList = Plan.objects.filter(user=request.user.pk, share__in=[1, 2, 3])

        serializer1 = PlanListInfoSerializer(myPlanList, many=True)
        print(serializer1.data)

        return Response({"myPlan": serializer1.data}, status=201)


# 운영자의 거절
class ApplyPlanRejectView(APIView):
    def post(self, request, planId):
        print("== 운영자의 여행계획 거절==")
        print(request.data)
        print(planId)
        plan = Plan.objects.get(pk=planId, share=1)

        plan.share = 3  # 거절

        plan.save()

        check = PlanRejectReaSon.objects.filter(plan=plan).exists()
        if check:
            PlanRejectReaSon.objects.filter(plan=plan).delete()

        PlanRejectReaSon.objects.create(plan=plan, content=request.data["rejectReason"])

        return Response({"rejectPlanId": planId}, status=201)

    def get(self, request, planId):
        print("== 운영자의 여행계획 거절 이유 취득==")

        plan = Plan.objects.get(pk=planId, share=3)

        reject = PlanRejectReaSon.objects.get(plan=plan)

        print(reject.content)

        return Response(reject.content, status=201)


# 운영자의 승인
class ApplyPlanAgreeView(APIView):
    @transaction.atomic
    def post(self, request, planId):
        print("== 운영자의 여행계획 승인==")

        # 공유할 플랜
        plan = Plan.objects.get(pk=planId, share=1)
        start_date = str(plan.start_date).split("-")
        end_date = str(plan.end_date).split("-")
        # yyyy mm dd 취득하기
        s_date = date(
            int(start_date[0]), int(start_date[1]), int(start_date[2])
        )  # date 객체1
        e_date = date(int(end_date[0]), int(end_date[1]), int(end_date[2]))  # date 객체2

        date_diff = e_date - s_date
        date_range = date_diff.days + 1

        plan.share = 2  # 승인

        plan.save()

        # 새로 만들어질 공유 플랜
        share_plan = SharePlan.objects.create(
            plan=plan,
            user=request.user,
            plan_title=plan.plan_title,
            location=plan.location,
            areacode=plan.areacode,
            range_date=date_range,
        )

        # 1. planDate -> shareDate로 복사
        # 2. 각 Date에 각 detail 취득 -> shareDetail 복사
        plandate = PlanDate.objects.filter(plan=plan).prefetch_related("detailPlace")
        plan_value = plandate.values(
            "pk",
            "plan",
            "nth_day",
            "detailPlace",
            "detailPlace__move_turn",
            "detailPlace__detail_img",
            "detailPlace__place_name",
            "detailPlace__place_location",
            "detailPlace__place_x",
            "detailPlace__place_y",
            "detailPlace__place_type",
            "detailPlace__house_id",
            "detailPlace__reservation_id",
        )

        for value in plan_value:
            print("==value==")
            print(value)
            plandate = value["pk"]
            plan = value["plan"]
            nth_day = value["nth_day"]
            detailPlace = value["detailPlace"]
            move_turn = value["detailPlace__move_turn"]
            detail_img = value["detailPlace__detail_img"]
            place_name = value["detailPlace__place_name"]
            place_location = value["detailPlace__place_location"]
            place_x = value["detailPlace__place_x"]
            place_y = value["detailPlace__place_y"]
            place_type = value["detailPlace__place_type"]
            house_id = value["detailPlace__house_id"]
            reservation_id = value["detailPlace__reservation_id"]

            spd = SharePlanDate.objects.get_or_create(
                share_plan=share_plan, nth_day=nth_day
            )[0]

            if detailPlace == None:  # 빈 Detail
                continue
            else:
                if place_type == "1":  # 숙소  = 1 일때 2로 변경 // 공유 계획에선 추천 상태로 보여주기 위함
                    ShareDetail.objects.create(
                        share_plan_date=spd,
                        move_turn=move_turn,
                        detail_img=detail_img,
                        place_name=place_name,
                        place_location=place_location,
                        place_x=place_x,
                        place_y=place_y,
                        place_type="2",
                        house_id=house_id,
                        reservation_id=reservation_id,
                    )
                else:
                    ShareDetail.objects.create(
                        share_plan_date=spd,
                        move_turn=move_turn,
                        detail_img=detail_img,
                        place_name=place_name,
                        place_location=place_location,
                        place_x=place_x,
                        place_y=place_y,
                        place_type=place_type,
                        house_id=house_id,
                    )

        return Response({"agreePlanId": planId}, status=201)


# admin 심사 - 계획
class EvaluatePlanView(APIView):
    def put(self, request):
        pass

    def get(self, request):
        print("공유계획 심사중 혹은 승인 리스트")
        print(request.user.pk)
        # user = User.objects.get(pk=request.user.pk)
        # share 1,2   // 1 : 심사중, 2:승인

        myPlanList = Plan.objects.filter(share=1)

        serializer1 = PlanListInfoSerializer(myPlanList, many=True)
        print(serializer1.data)

        return Response({"myPlan": serializer1.data}, status=201)


# 여행 각 날짜의 리스트
class DetailPlanView(APIView):
    def get(self, request, travelNo):
        print("여행 번호 : " + str(travelNo))
        print("여행 디테일")
        print(request.user.pk)
        plan = Plan.objects.filter(pk=travelNo)

        serializer = PlanChoiceSerializer(plan, many=True)

        print(plan.filter(user=request.user.pk).exists())
        checkState = plan.filter(user=request.user.pk).exists()
        state = None
        if checkState:
            # 방장일 경우 1
            state = "1"
        else:
            # 방장이 아닐 경우 0
            state = "0"
        print("====최종데이터===")
        print(serializer.data)

        print("====친구===")
        user = User.objects.get(pk=request.user.pk)
        planMember = PlanMember.objects.filter(plan=travelNo)
        MemberUserId = planMember.values("user_id")

        myFriend = user.friends.all().exclude(userFrom_id__in=MemberUserId)

        print("====맴버===")
        print(planMember)
        memberFriendSerial = PlanMemberSerializer(planMember, many=True)
        print(memberFriendSerial.data)
        print("====친구맴버에 포함 안된 ===")
        print(myFriend.values())

        noMemberFriendSerial = NoMemberFriendInfoSerializer(myFriend, many=True)
        print(noMemberFriendSerial.data)

        # serializer = GetChattingSerializer(chatting, many=True)
        # print(travelNo)
        # print(serializer.data)
        return Response(
            {
                "planInfo": serializer.data,
                "state": state,
                "member": memberFriendSerial.data,
                "noMemberFriend": noMemberFriendSerial.data,
            },
            status=201,
        )


# API를 통해 여행 지역번호 취득해서, 해당 정보 가져오기
class AreaPlanView(APIView):
    def get(self, request, areacode):
        print("여행 지역번호 : " + str(areacode))

        test = getSiGunGuCodeData(str(areacode))

        print(test)
        return Response(test, status=201)


# API를 통해 여행 지역번호와 시군구, 페이지 정보를 통해 해당 정보 가져오기
class SiGunGuPlanView(APIView):
    def get(self, request, areacode, sigungu, page):
        print("여행 areacode : " + str(areacode))
        print("여행 sigungu : " + str(sigungu))
        print("여행 page : " + str(page))

        test = getPlaceData(str(areacode), str(sigungu), str(page))
        print("test")
        print(test)
        return Response(test, status=201)


# 해당 여행지 클릭시 정보 취득
class PlaceIdView(APIView):
    def get(self, request, placeId):
        print("여행 placeId : " + str(placeId))

        test = getPlaceId(str(placeId))
        print("test")
        print(test)
        return Response(test, status=201)


class DetailDateView(APIView):
    @transaction.atomic
    def post(self, request, planId):
        print("저장및수정 : " + str(planId))
        print(request.user.pk)
        Data = request.data
        print("====DetailDateView===")
        print(Data)
        schedules = Data["schedule"]
        reservation_id_save = []  # 저장할 데이터 들 중 숙소 예약 번호만 취득
        for i in schedules:
            print("==schedules==")
            print(i)
            date_pk = i["pk"]
            print(date_pk)
            detailPlaces = i["detailPlace"]

            for j in detailPlaces:
                print("==detailPlaces j==")
                print(j)

                if j["place_type"] == "1":
                    reservation_id_save.append(j["reservation_id"])

            # # 1. 삭제
            detailPlan_place = DetailPlan.objects.filter(
                plan_date=date_pk, place_type__in=["0", "2"]
            )
            detailPlan_place.delete()

        # print(reservation_id_save)

        # # # 1-2 숙소 필터링
        house_reservation_list = HouseReservationBoard.objects.filter(plan=planId)

        print("-----------------reservation_id_save------------------------")
        print(reservation_id_save)

        # # # 1-3 중복 확인
        for qs in house_reservation_list:
            print("qs.pk : " + str(qs.pk))
            if str(qs.pk) in list(set(reservation_id_save)):
                print("포함 : ")
            else:
                print("미포함 - 삭제 : 해당 여행 삭제")

                # plan = Plan.objects.get(pk=Data["plan_id"])

                reservation = HouseReservationBoard.objects.get(pk=qs.pk)
                reservation.delete()
                # # "house", "reservation_date", "plan"
            DetailPlan.objects.filter(reservation_id=qs.pk).delete()
            # 해당 숙소 모두 삭제(detail에서)

        # # "house", "reservation_date", "plan"

        # serializer = DetailDatePlanSerializer(
        #     data=request.data, context={"obj": request.data}, partial=True
        # )

        # serializer.create(validated_data=request.data)

        # if serializer.is_valid():

        #     serializer.save()

        # 공유 후 추천 숙소 어떻게 할지 처리
        # 생성
        for i in schedules:
            print("==schedules==")
            date_pk = i["pk"]
            detailPlaces = i["detailPlace"]
            plan_date_instance = PlanDate.objects.get(pk=date_pk)
            for j in detailPlaces:
                print("==detailPlaces j==")
                print(j)

                DetailPlan.objects.create(
                    move_turn=j["move_turn"],
                    detail_img=j["detail_img"],
                    place_name=j["place_name"],
                    place_location=j["place_location"],
                    place_x=j["place_x"],
                    place_y=j["place_y"],
                    place_memo=j["place_memo"],
                    plan_date=plan_date_instance,
                    place_type=j["place_type"],
                    house_id=j.get("house_id", "0"),
                    reservation_id=j.get("reservation_id", "0"),
                )

        print("성공")
        return Response("성공", status=201)


# 맴버 강퇴

# permission_classes = (AllowAny,)
# 왜 delete로 하면 안되는지 모르겠음  => axios에서 해결 할 수 있었음. TODO 수정하기
class KickOutsView(APIView):
    def post(self, request, memberId, planNo):
        print("====KickOutView===")
        print(memberId)

        print(planNo)

        # 1. 삭제
        planMember = PlanMember.objects.filter(plan=planNo, user=memberId)
        planMember.delete()
        print("???")

        # 맴버에서 삭제된 친구
        user = User.objects.get(pk=request.user.pk)

        myFriend = user.friends.all().get(userFrom_id=memberId)
        # filter(userFrom=memberId)

        print("====친구맴버에 포함 안된 ===")
        print("memberId " + str(memberId))
        # print("myFriend " + myFriend.values())
        noMemberFriendSerial = NoMemberFriendInfoSerializer(myFriend)
        print(noMemberFriendSerial.data)

        return Response(noMemberFriendSerial.data, status=201)


# 맴버 초대
class InviteView(APIView):
    def post(self, request):
        print("====InviteView===")
        print(request.data)
        memberDate = request.data
        # 1. 등록
        plan = Plan.objects.get(pk=memberDate["plan"])
        user = User.objects.get(pk=memberDate["user"])
        planMember = PlanMember.objects.get_or_create(
            plan=plan,
            user=user,
            state=memberDate["state"],
            complete=memberDate["complete"],
        )[0]
        serializer = PlanMemberSerializer(planMember)
        print(serializer.data)
        return Response(serializer.data, status=201)


# 맴버 리스트
class ShowMemberListView(APIView):
    def get(self, request, planId):
        print("==ShowMemberListView==")
        planMember = PlanMember.objects.filter(plan=planId, complete="1")
        memberFriendSerial = PlanMemberSerializer(planMember, many=True)

        print(memberFriendSerial.data)

        return Response(memberFriendSerial.data, status=201)


# 여행 승인
class AgreePlanView(APIView):
    def get(self, request, planId):
        print("==AgreePlanView==")

        print(planId)
        print(request.user.pk)
        planMember = PlanMember.objects.get(plan=planId, user=request.user.pk)
        planMember.complete = "1"
        planMember.save()

        myPlanMember = PlanMember.objects.filter(
            plan=planId, user=request.user.pk, complete="1"
        )

        serializer1 = PlanListSerializer(myPlanMember, many=True)
        print(serializer1.data)

        return Response(serializer1.data, status=201)


# 여행 거절
class RejectPlanListView(APIView):
    def get(self, request, planId):
        print("==RejectPlanView==")

        PlanMember.objects.get(plan=planId, user=request.user.pk).delete()

        return Response("", status=201)


# 여행 탈퇴
class WithdrawListView(APIView):
    def post(self, request, planId):
        print("==WithdrawPlanView==")

        print(planId)
        print(request.data)
        print(request.user.pk)
        state = request.data["state"]
        if state == "1":
            # 방장이 삭제
            print("모두 삭제")
            # PlanMember.objects.get(plan=planId).delete()
            Plan.objects.get(pk=planId).delete()
        else:
            PlanMember.objects.get(plan=planId, user=request.user.pk).delete()

        return Response("", status=201)


# 날짜변경
class PlanDateChangeView(APIView):
    def post(self, request, planId):
        print("==PlanDateChangeView==")

        print(planId)
        print(request.data)
        sDate = request.data["sDate"]
        eDate = request.data["eDate"]
        schedule = request.data["schedule"]
        dateList = [i["date"] for i in schedule]
        print("==dateList==")
        print(dateList)
        plan = Plan.objects.get(id=planId)
        print("===plan===")
        print(plan)
        plan_date = PlanDate.objects.filter(plan=plan).order_by("id")
        plan_last_id = plan_date[len(plan_date) - 1].id
        print("==plan_last_id==" + str(plan_last_id))
        print("===plan_date===")
        print(plan_date)

        print("===plan_detail===")
        origin_plan_detail = (
            DetailPlan.objects.filter(plan_date__in=plan_date)
            .order_by("id")
            .select_related("plan_date")
        )
        print(origin_plan_detail.query)
        for qs in origin_plan_detail:
            place_type = qs.place_type
            date = qs.plan_date.date
            print(place_type)
            print(date)
            if place_type == "1":  # and (str(date) not in dateList)
                print("안되에~")
                return Response("includeHouse", status=201)
                # 숙소가 날짜 범위안에 없기 때문에 변경 할 수 없다.
        print("=======변경시작=========")
        plan.start_date = sDate
        plan.end_date = eDate
        plan.save()
        print("길이")
        print(len(plan_date))
        for i, v in enumerate(schedule):

            date = v["date"]
            nth_day = v["nth_day"]
            print("i : " + str(i))
            print("date : " + date)
            print("nth_day : " + str(nth_day))
            # 새로운 date 만들기
            new_plan_date = PlanDate.objects.create(
                plan=plan, date=date, nth_day=nth_day
            )
            print("new_plan_date 생성")
            if i < len(plan_date):
                print("for " + str(i))
                plan_detail = DetailPlan.objects.filter(plan_date=plan_date[i])
                for qs in plan_detail:
                    qs.plan_date = new_plan_date
                    qs.save()

                print(plan_detail)
            # PlanDate.objects.create(plan=plan, date=date , nth_day= nth_day )
        print("==plan_last_id end ==" + str(plan_last_id))
        plan_date.filter(id__lte=plan_last_id).delete()
        # plan_detail.delete()
        print("=============")

        serializer = PlanChoiceSerializer(plan)

        return Response(serializer.data, status=201)
        # return Response("", status=201)


# 공유 여행 검색
class SharePlanSearchView(APIView):
    def get(self, request, location):
        print("==SharePlanSearchView==")
        print("location : " + location)

        sharePlanList = SharePlan.objects.filter(location__contains=location)

        serializer = SharePlanListInfoSerializer(sharePlanList, many=True)
        print(serializer.data)

        return Response(serializer.data, status=201)


# 공유 여행 정보 보기
class ShareDetailPlanSearchView(APIView):
    def get(self, request, shareId):
        print("==ShareDetailPlanSearchView==")
        print("shareId : " + str(shareId))

        sharePlan = SharePlan.objects.get(id=shareId)
        print(sharePlan.plan_title)
        serializer = SharePlanInfoSerializer(sharePlan)
        print(serializer.data)

        return Response(serializer.data, status=201)

    @transaction.atomic
    def post(self, request, shareId):
        print("==post ShareDetailPlanSearchView==")
        print("shareId : " + str(shareId))
        print(request.data)
        start_date = request.data["inputDate"]
        rangeDate = request.data["rangeDate"]
        plan_title = request.data["inputTitle"]

        location = request.data["location"]

        areaCode = request.data["areaCode"]

        # 날짜 데이터 정리

        # 년 월 일 구분
        start_date_list = str(start_date).split("-")

        s_date = date(
            int(start_date_list[0]), int(start_date_list[1]), int(start_date_list[2])
        )  # date 객체1

        # 최종 날짜 데이터
        result_date_list = []
        for i in range(int(rangeDate)):
            next_day = s_date + timedelta(days=i)
            result_date_list.append(next_day.strftime("%Y-%m-%d"))

        print(result_date_list)

        # 1. 플랜 생성
        plan = Plan.objects.create(
            user=request.user,
            plan_title=plan_title,
            is_share=True,  # 공유 받았으니깐 True
            share_id=shareId,  # 별점 주기용
            start_date=result_date_list[0],
            end_date=result_date_list[-1],
            location=location,
            areacode=areaCode,
        )

        # 1-1. 공유에 1+ 증가
        sp = SharePlan.objects.get(pk=shareId)
        sp.share += 1
        sp.save()

        # 2. 플랜 날짜 생성
        for i, v in enumerate(result_date_list):
            PlanDate.objects.create(plan=plan, date=v, nth_day=i + 1)

        plandate_list = PlanDate.objects.filter(plan=plan)

        # 3. 디테일 플랜 생성

        sharePlan = SharePlan.objects.get(id=shareId)
        print(sharePlan.plan_title)
        # 3-1 디테일에 필요한 데이터 격납
        serializer = SharePlanInfoSerializer(sharePlan)
        print(serializer.data)
        print("=== shchdule ===")

        for i, plan_date in enumerate(plandate_list):
            print(i)
            details = serializer.data["share_schedule"][i]["share_detailPlace"]
            for j in details:
                placeType = None
                if j["place_type"] == "1":
                    placeType = "2"
                else:
                    placeType = j["place_type"]
                    DetailPlan.objects.create(
                        house_id=j["house_id"],
                        plan_date=plan_date,
                        move_turn=j["move_turn"],
                        detail_img=j["detail_img"],
                        place_name=j["place_name"],
                        place_location=j["place_location"],
                        place_x=j["place_x"],
                        place_y=j["place_y"],
                        place_type=placeType,
                        reservation_id=j["reservation_id"],
                    )
        print(serializer.data["share_schedule"][0])

        # 4. 여행 맴버에 추가
        pm = PlanMember.objects.create(
            user=request.user, plan=plan, state="1", complete="1"
        )

        serializer1 = PlanListSerializer(pm)

        print("성공")

        return Response(serializer1.data, status=201)


# 공유 점수 주기
class ShareScoreView(APIView):
    def get(self, request, shareId, planId):
        print("==get ShareScoreView==")
        print("shareId : " + str(shareId))

        sc = ShareScore.objects.filter(
            share_plan=shareId, user=request.user, plan=planId
        )

        if sc.exists():
            return Response(sc[0].score, status=201)
        else:
            return Response(0, status=201)

    def post(self, request, shareId, planId):
        print("==post ShareScoreView==")
        print("shareId : " + str(shareId))

        score = request.data["shareScore"]

        ss = ShareScore.objects.filter(
            share_plan=shareId, user=request.user, plan=planId
        )

        if ss.exists():
            print("== 업데이트 : " + str(score))
            # 업데이트
            prev_score = ss[0].score
            print("ss[0].score 1: " + str(ss[0].score))
            print("ss[0].score 1-1: " + str(score))
            ss.update(score=score)

            # 계산
            share = SharePlan.objects.get(pk=shareId)
            share.recommend -= prev_score - score
            share.save()
            return Response("업데이트", status=201)
        else:
            print("== 생성 : " + str(score))
            plan = Plan.objects.get(pk=planId)
            share_plan = SharePlan.objects.get(pk=shareId)
            ShareScore.objects.create(
                share_plan=share_plan, user=request.user, plan=plan, score=score
            )

            share = SharePlan.objects.get(pk=shareId)
            share.recommend += score
            share.save()
            return Response("생성", status=201)


# 계획 존재 여부
class PlanCheckExistView(APIView):
    def get(self, request, planId):
        print("==get PlanCheckExistView==")
        print("planId : " + str(planId))

        check = Plan.objects.filter(pk=planId).exists()

        if check:
            return Response(check, status=201)
        else:
            return Response(check, status=201)


# 베스트 여행계획
class ShareBestPlanView(APIView):
    def get(self, request, shareType):
        print("==get ShareBestPlanView==")
        print("shareType : " + str(shareType))

        sharePlanList = None
        if shareType == 0:  # 공유 수
            sharePlanList = SharePlan.objects.all().order_by("-share")[:5]
            serializer = SharePlanListInfoSerializer(sharePlanList, many=True)
            print(serializer.data)
            return Response(serializer.data, status=201)
        else:  # 1일 경우, 평점순
            sharePlanList = (
                ShareScore.objects.all()
                .select_related("share_plan")
                .values("share_plan")
                .annotate(score_average=Avg("score"))
                .order_by("-score_average")[:5]
            )
            print("== 1 == ")

            print(sharePlanList)
            planList = [i["share_plan"] for i in sharePlanList]
            scoreList = [i["score_average"] for i in sharePlanList]
            print(planList)

            shareplan = SharePlan.objects.filter(pk__in=planList)
            serializer = SharePlanListInfoSerializer(shareplan, many=True)
            print(serializer.data)
            return Response(
                {"sharePlan": serializer.data, "score": scoreList}, status=201
            )

