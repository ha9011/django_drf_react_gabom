from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import (
    HouseRegistSerializer,
    HouseInfoSerializer,
    HouseNoticeSerializer,
    ReservationDetailPlanSerializer,
    HouseQnaSerializer,
    HouseQnaRepleSerializer,
    ReservationCountSerializer,
    ReservationUserListSerializer,
    RecoReservationDetailPlanSerializer,
    ReservationBookListSerializer,
)
from django.db.models import Avg, Count
from django.contrib.auth import get_user_model
from .models import (
    HousedetaiiImage,
    Houseregist,
    HouseNoticeBoard,
    HouseQnaBoard,
    HouseReservationBoard,
    HouseQnaRepleBoard,
    HouseScore,
    HouseLike,
    HouseRejectReaSon,
)
from plans.models import Plan
from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_date
from plans.models import DetailPlan
from .pdate import date_range

User = get_user_model()


class HouseRegistView(APIView):
    def post(self, request):
        formData = request.data
        print(formData)
        print("==re==")
        print(request.user.id)
        formData["houseId"] = request.user.id
        serializer = HouseRegistSerializer(
            data=request.data, context={"request": request}
        )

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def get(self, request):
        houseRegist = Houseregist.objects.all().filter(houseId=request.user.id)

        serializer = HouseInfoSerializer(houseRegist, many=True)
        return Response(serializer.data, status=201)


class HouseByIdView(APIView):
    def get(self, request, pk):
        print("====HouseByIdView get=====")
        print("pk : " + str(pk))
        print(request.data)
        user = User.objects.get(pk=request.user.pk)
        print(1)
        house = Houseregist.objects.filter(pk=pk)
        print(2)
        houseTotal = house.prefetch_related("house_like", "house_like_user")
        print(3)
        score = HouseScore.objects.filter(house=house[0]).aggregate(avr=Avg("score"))
        like = HouseLike.objects.filter(house=house[0]).aggregate(count=Count("user"))
        myLike = HouseLike.objects.filter(house=house[0], user=user).exists()
        print("......HouseByIdView query............")
        print(houseTotal.query)
        print("......score............")
        print(score)
        if score["avr"] == None:
            score["avr"] = 0

        print(score["avr"])

        print("......like............")
        print(like["count"])

        print("......myLike............")
        print(myLike)

        serializer = HouseInfoSerializer(house[0])

        print(serializer.data)

        return Response(
            {
                "houseInfo": serializer.data,
                "score": score["avr"],
                "like": like["count"],
                "myLike": myLike,
            },
            status=201,
        )


class HouseByIdAndDateView(APIView):
    def get(self, request, pk, search):
        print("====HouseByIdView get=====")
        print("pk : " + str(pk))
        print("date : " + str(search))
        user = User.objects.get(pk=request.user.pk)
        print(1)
        house = Houseregist.objects.filter(pk=pk)
        print(2)
        houseTotal = house.prefetch_related("house_like", "house_like_user")
        print(3)
        score = HouseScore.objects.filter(house=house[0]).aggregate(avr=Avg("score"))
        like = HouseLike.objects.filter(house=house[0]).aggregate(count=Count("user"))
        myLike = HouseLike.objects.filter(house=house[0], user=user).exists()

        reservationFlag = None
        if search == 1:
            reservationFlag = False
        elif search == 0:
            pass
            # reservationFlag = HouseReservationBoard.objects.filter(
            #     house=house[0], user=user, reservation_date=date
            # ).exists()
        print("......HouseByIdView query............")
        print(houseTotal.query)
        print("......score............")
        print(score)
        if score["avr"] == None:
            score["avr"] = 0

        print(score["avr"])

        print("......like............")
        print(like["count"])

        print("......myLike............")
        print(myLike)

        serializer = HouseInfoSerializer(house[0])

        print(serializer.data)

        return Response(
            {
                "houseInfo": serializer.data,
                "score": score["avr"],
                "like": like["count"],
                "myLike": myLike,
                "reservationFlag": reservationFlag,
            },
            status=201,
        )


class HouseSearchView(APIView):
    def post(self, request, keyword):
        print("keyword : " + str(keyword))
        print("request.data : ")
        print(request.data)
        temp_date = parse_date(request.data["date"])
        searchHouseRegist = Houseregist.objects.all().filter(
            houseAddress__icontains=str(keyword),
            is_active=True,
            startDate__lte=temp_date,
            endDate__gte=temp_date,
        )
        scoreList = []
        likeList = []
        for qs in searchHouseRegist:

            score = HouseScore.objects.filter(house=qs).aggregate(avr=Avg("score"))
            like = HouseLike.objects.filter(house=qs).aggregate(count=Count("user"))
            if score["avr"] == None:
                score["avr"] = 0
            scoreList.append(score)
            likeList.append(like)

        print(searchHouseRegist.query)
        print(scoreList)
        print(likeList)
        serializer = HouseInfoSerializer(searchHouseRegist, many=True)
        print(serializer.data)

        return Response(
            {
                "searchHouse": serializer.data,
                "scoreList": scoreList,
                "likeList": likeList,
            },
            status=201,
        )


class HouseNoticeView(APIView):
    def post(self, request, pk):
        print("keyword : " + str(pk))
        print("request.data : ")
        print(request.data)
        title = request.data["content"]["title"]
        content = request.data["content"]["content"]
        houseregi = get_object_or_404(Houseregist, pk=pk)
        notice_house = HouseNoticeBoard.objects.create(
            house=houseregi, title=title, content=content
        )

        serializer = HouseNoticeSerializer(notice_house)
        print(serializer.data)

        return Response(serializer.data, status=201)

    def put(self, request, pk):
        print("update : " + str(pk))
        print("request.data : ")
        print(request.data)
        title = request.data["content"]["title"]
        content = request.data["content"]["content"]
        houseId = int(request.data["houseId"])

        print("1")
        houseregi = get_object_or_404(Houseregist, pk=houseId)
        print("2")
        notice_house = HouseNoticeBoard.objects.filter(id=pk).update(
            title=title, content=content
        )
        print("3")
        notice_house = HouseNoticeBoard.objects.filter(house=houseregi)
        serializer = HouseNoticeSerializer(notice_house, many=True)
        print(serializer.data)

        return Response(serializer.data, status=201)

    def delete(self, request, pk):
        print("update : " + str(pk))

        HouseNoticeBoard.objects.filter(id=pk).delete()

        return Response(pk, status=201)


class HouseQnaView(APIView):
    def post(self, request, pk):
        print("keyword : " + str(pk))
        print("request.data : ")
        print(request.data)

        title = request.data["content"]["title"]
        content = request.data["content"]["content"]
        public = request.data["content"]["public"]
        user = User.objects.get(pk=request.user.pk)
        houseregi = get_object_or_404(Houseregist, pk=pk)
        qna_house = HouseQnaBoard.objects.create(
            house=houseregi, title=title, content=content, public=public, user=user
        )

        serializer = HouseQnaSerializer(qna_house)
        print(serializer.data)

        return Response(serializer.data, status=201)

    def put(self, request, pk):
        print("update : " + str(pk))
        print("request.data : ")
        print(request.data)
        title = request.data["content"]["title"]
        content = request.data["content"]["content"]
        public = request.data["content"]["public"]
        houseId = int(request.data["houseId"])

        print("1")
        houseregi = get_object_or_404(Houseregist, pk=houseId)
        print("2")
        qna_house = HouseQnaBoard.objects.filter(id=pk).update(
            title=title, content=content, public=public
        )
        print("3")
        qna_house = HouseQnaBoard.objects.filter(house=houseregi)
        serializer = HouseQnaSerializer(qna_house, many=True)
        print(serializer.data)

        return Response(serializer.data, status=201)

    def delete(self, request, pk):
        print("update : " + str(pk))

        HouseQnaBoard.objects.filter(id=pk).delete()

        return Response(pk, status=201)


class HouseQnaRepleView(APIView):
    def get(self, request, pk):
        print("get HouseQnaRepleView : " + str(pk))

        houseboard = get_object_or_404(HouseQnaBoard, pk=pk)
        print(houseboard)
        qna_reple = HouseQnaRepleBoard.objects.filter(houseqnaboard=houseboard)
        print(qna_reple)
        serializer = HouseQnaRepleSerializer(qna_reple, many=True)
        print(serializer.data)

        return Response(serializer.data, status=201)

    def post(self, request, pk):
        print("houseId : " + str(pk))
        print("request.data : ")
        print(request.data)

        content = request.data["content"]

        user = User.objects.get(pk=request.user.pk)
        houseboard = get_object_or_404(HouseQnaBoard, pk=pk)
        qna_reple = HouseQnaRepleBoard.objects.create(
            houseqnaboard=houseboard, content=content, user=user
        )

        serializer = HouseQnaRepleSerializer(qna_reple)
        print(serializer.data)

        return Response(serializer.data, status=201)

    def put(self, request, pk):
        print("update HouseQnaRepleView : " + str(pk))
        print("request.data : ")
        print(request.data)

        content = request.data["content"]

        print("2")
        qna_house_reple = HouseQnaRepleBoard.objects.filter(id=pk).update(
            content=content
        )

        print("success")
        return Response("", status=201)

    def delete(self, request, pk):
        print("update : " + str(pk))

        HouseQnaRepleBoard.objects.filter(id=pk).delete()

        return Response(pk, status=201)


class HouseReservationView(APIView):
    def post(self, request, houseId):
        print("== HouseReservationView ==")
        print("keyword : " + str(houseId))
        print("request.data : ")
        print(request.data)
        # 추천을 통한 여부 // houseId 와 placetyoe 2인애들 삭제, reservation_id인 애들 삭제
        reco = request.data["reco"]

        reservation_range = request.data[
            "reservation_range"
        ]  # ex) [{'date': '2021-03-29', 'nth_day': 2}, {'date': '2021-03-30', 'nth_day': 3}]
        planId = request.data["planId"]

        houseregi = Houseregist.objects.get(pk=houseId)
        print(houseregi)
        plan = get_object_or_404(Plan, pk=planId)
        print("1")

        # 여행 계획 만들기,
        obj, check = HouseReservationBoard.objects.get_or_create(
            reservation_sdate=reservation_range[0]["date"],
            reservation_edate=reservation_range[len(reservation_range) - 1]["date"],
            house=houseregi,
            user=request.user,
            plan=plan,
        )
        print("2")

        print(check)
        if check == True:
            if reco:
                reservation_id = request.data["reservation_id"]
                print("==추천 예약==")
                serializer = RecoReservationDetailPlanSerializer(
                    instance=houseregi,
                    data=request.data,
                    context={
                        "reserId": obj.pk,
                        "reservation_range": request.data["reservation_range"],
                        "reservation_id": reservation_id,
                    },
                    partial=True,
                )
                if serializer.is_valid():
                    serializer.save()
                    print("--serializer.data--")
                    print(serializer.data)
                    return Response(serializer.data, status=201)
                return Response(serializer.errors, status=400)

            else:
                print("==일반 예약==")
                serializer = ReservationDetailPlanSerializer(
                    instance=houseregi,
                    data=request.data,
                    context={
                        "reserId": obj.pk,
                        "reservation_range": request.data["reservation_range"],
                    },
                    partial=True,
                )
                if serializer.is_valid():
                    serializer.save()
                    print("--serializer.data--")
                    print(serializer.data)
                    return Response(serializer.data, status=201)
                return Response(serializer.errors, status=400)
        else:
            return Response({"date": "exist"}, status=201)

    def delete(self, request, houseId):
        print("--HouseReservationView delete--")
        print("keyword : " + str(houseId))
        print("request.data : ")

        # {'date': '2021-06-16', 'planId': 44, 'planDateId': 139}
        date = request.data["date"]
        planId = request.data["planId"]
        planDateId = request.data["planDateId"]

        detailPlan = DetailPlan.objects.get(house_id=str(houseId), plan_date=planDateId)
        print(1)
        # 해당 숙소 번호
        this_move = detailPlan.move_turn
        print(2)
        # 삭제
        detailPlan.delete()
        # 숙소에서도 삭제
        reservation = HouseReservationBoard.objects.get(
            plan=planId, house=str(houseId), reservation_date=date
        )
        reservation.delete()

        print(3)
        detailPlanAll = DetailPlan.objects.filter(
            plan_date=planDateId, move_turn__gt=this_move
        )
        print(4)
        for qs in detailPlanAll:
            qs.move_turn = this_move
            qs.save()
            this_move += 1

        return Response("성공", status=201)
        # if qs.house_id in house_save:
        #     print("포함")
        # else:
        #     print("미포함 - 삭제")
        #     print(Data["plan_id"])
        #     print(Data["date"])
        #     print(qs.house_id)
        #     plan = Plan.objects.get(pk=Data["plan_id"])
        #     reservation = HouseReservationBoard.objects.get(
        #         plan=Data["plan_id"],
        #         house=qs.house_id,
        #         reservation_date=Data["date"],
        #     )
        #     reservation.delete()

        #     serializer = ReservationDetailPlanSerializer(
        #         instance=houseregi, data=request.data
        #     )
        #     if serializer.is_valid():
        #         serializer.save()
        #         print("--serializer.data--")
        #         print(serializer.data)
        #         return Response(serializer.data, status=201)
        #     return Response(serializer.errors, status=400)
        # else:
        #     return Response({"date": "exist"}, status=201)


class HouseLikeView(APIView):
    def post(self, request, pk):
        print("houseId : " + str(pk))

        user = User.objects.get(pk=request.user.pk)
        houseregi = Houseregist.objects.get(pk=pk)
        houseregi.like += 1
        houseregi.save()
        houseLike = HouseLike.objects.create(house=houseregi, user=user)

        print(houseLike)
        return Response(True, status=201)

    def delete(self, request, pk):
        print("delete : " + str(pk))

        user = User.objects.get(pk=request.user.pk)
        houseregi = Houseregist.objects.get(pk=pk)
        houseregi.like -= 1
        houseregi.save()
        houseLike = HouseLike.objects.get(house=houseregi, user=user).delete()
        print(houseLike)
        return Response(False, status=201)


class HouseReservationCountView(APIView):
    def get(self, request, smonth, emonth, pk):
        print("get HouseReservationCountView : ")
        print("smonth : " + smonth)
        print("emonth : " + emonth)
        print("pk : " + str(pk))
        dateList = date_range(smonth, emonth)
        print(dateList)
        result = []
        for i in dateList:
            countDict = {}
            countDict["reservation_date"] = i
            countHr = HouseReservationBoard.objects.filter(
                house=pk, reservation_sdate__lte=i, reservation_edate__gte=i,
            ).count()
            countDict["count"] = countHr
            result.append(countDict)
        # hr = (
        #     HouseReservationBoard.objects.filter(
        #         reservation_sdate__range=(smonth, emonth),
        #         reservation_edate__range=(smonth, emonth),
        #         house=pk,
        #     )
        #     .annotate(count=Count("reservation_date"))
        #     .values("reservation_date", "count")
        # )

        # serializer = ReservationCountSerializer(hr, many=True)
        print(result)
        # print(serializer.data)
        print("======")
        # houseboard = get_object_or_404(HouseQnaBoard, pk=pk)
        # print(houseboard)
        # qna_reple = HouseQnaRepleBoard.objects.filter(houseqnaboard=houseboard)
        # print(qna_reple)
        # serializer = HouseQnaRepleSerializer(qna_reple, many=True)
        # print(serializer.data)

        return Response(result, status=201)


class HouseReservationListCountView(APIView):
    def get(self, request, date, pk):
        print("get HouseReservationListCountView : ")
        print("date : " + date)

        print("pk : " + str(pk))
        hr = HouseReservationBoard.objects.filter(
            house=pk, reservation_sdate__lte=date, reservation_edate__gte=date,
        )

        serializer = ReservationUserListSerializer(hr, many=True)
        print(hr)
        print(serializer.data)
        print("======")

        return Response(serializer.data, status=201)


class HouseEvaluateListView(APIView):
    def get(self, request):
        print("get HouseEvaluateListView : ")

        hr = Houseregist.objects.filter(is_active=0)

        serializer = HouseRegistSerializer(hr, many=True)
        print(hr)
        print(serializer.data)
        print("======")

        return Response(serializer.data, status=201)


# 하우스 운영 승낙
class HouseEvaluateAgreeView(APIView):
    def post(self, request, pk):
        print("post HouseEvaluateAgreeView : ")

        hr = Houseregist.objects.get(pk=pk)
        hr.is_active = 1  # 승인
        hr.save()

        print(hr)

        print("======")

        return Response({"agreeAgree": pk}, status=201)


# 하우스 운영 거절
class HouseEvaluateRejectView(APIView):
    def post(self, request, pk):
        print("post HouseEvaluateRejectView : ")

        hr = Houseregist.objects.get(pk=pk)
        hr.is_active = 2  # 거절
        hr.save()

        check = HouseRejectReaSon.objects.filter(houseregist=hr).exists()
        if check:
            HouseRejectReaSon.objects.filter(houseregist=hr).delete()

        HouseRejectReaSon.objects.create(
            houseregist=hr, content=request.data["rejectReason"]
        )
        print(hr)

        return Response({"rejectHouse": pk}, status=201)


# 하우스 거절 이유와 초기화
class HouseRejectShowView(APIView):
    def get(self, request, pk):
        print("get HouseRejectShowView : " + str(pk))

        reject = HouseRejectReaSon.objects.get(houseregist=pk)

        return Response(reject.content, status=201)

    def delete(self, request, pk):
        print("delete HouseRejectShowView : " + str(pk))

        HouseRejectReaSon.objects.get(houseregist=pk).delete()

        hr = Houseregist.objects.get(pk=pk)
        hr.is_active = 0  # 다시 심사대기로
        hr.save()

        houseRegist = Houseregist.objects.all().filter(houseId=request.user.id)

        serializer = HouseInfoSerializer(houseRegist, many=True)
        return Response(serializer.data, status=201)


# 하우스 삭제
class HouseDeleteShowView(APIView):
    def delete(self, request, pk):
        print("delete HouseDeleteShowView : " + str(pk))

        Houseregist.objects.filter(pk=pk).delete()

        return Response("삭제", status=201)


# 하우스 업데이트
class HouseUpdateShowView(APIView):
    def patch(self, request, pk):
        print("put HouseUpdateShowView : " + str(pk))

        formData = request.data
        print(formData)
        print("==re==")
        print(request.user.id)
        print("o")
        # formData["houseId"] = request.user.id
        print("1")
        houseRegist = Houseregist.objects.get(pk=pk)
        print("2")
        print(houseRegist)

        serializer = HouseRegistSerializer(
            instance=houseRegist,
            data=request.data,
            context={"request": request},
            partial=True,
        )

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


# 내 예약 내역
class HouseBookListView(APIView):
    def get(self, request):
        print("==HouseBookListView==")
        booklist = HouseReservationBoard.objects.filter(user=request.user.id)
        print(booklist)
        serializer = ReservationBookListSerializer(booklist, many=True)

        print(serializer.data)
        return Response(serializer.data, status=201)


# 내 예약 내역
class HouseScoreView(APIView):
    def get(self, request, housePk, bookPk):
        print("==HouseScoreView==")
        print("==housePk== : " + str(housePk))
        print("==bookPk== : " + str(bookPk))

        check = HouseScore.objects.filter(house=housePk, reservation=bookPk)

        if check.exists():
            return Response(check[0].score, status=201)
        else:
            return Response(0, status=201)

    def post(self, request, housePk, bookPk):
        print("post HouseScoreView : ")
        print("==housePk== : " + str(housePk))
        print("==bookPk== : " + str(bookPk))
        print(request.data)

        check = HouseScore.objects.filter(house=housePk, reservation=bookPk).exists()
        hr = Houseregist.objects.get(pk=housePk)
        # 존재 할경우 수정
        if check:
            updateScore = HouseScore.objects.get(house=housePk, reservation=bookPk)
            prev_score = updateScore.score
            updateScore.score = int(request.data["score"])
            updateScore.save()
            hr.score += int(request.data["score"]) - int(prev_score)
            return Response("업데이트", status=201)
        # 존재 안할 경우 생성
        else:
            reservate = HouseReservationBoard.objects.get(pk=bookPk)

            HouseScore.objects.create(
                house=hr,
                reservation=reservate,
                score=int(request.data["score"]),
                user=request.user,
            )

            return Response("생성", status=201)


# 하우스 베스트
class HouseBestView(APIView):
    def get(self, request, houseType):
        print("==get HouseBestView==")
        print("houseType : " + str(houseType))

        houseList = None
        if houseType == 0:  # 좋아요 수
            houseList = Houseregist.objects.all().order_by("-like")[:5]
            serializer = HouseInfoSerializer(houseList, many=True)
            print(serializer.data)
            return Response(serializer.data, status=201)
        else:  # 1일 경우, 평점순
            AvgHouseList = (
                HouseScore.objects.all()
                .select_related("house")
                .values("house")
                .annotate(score_average=Avg("score"))
                .order_by("-score_average")[:5]
            )
            print("== 1 == ")

            print(AvgHouseList)
            houseAvgList = [i["house"] for i in AvgHouseList]
            scoreList = [i["score_average"] for i in AvgHouseList]
            print(houseList)

            houseList = Houseregist.objects.filter(pk__in=houseAvgList)
            serializer = HouseInfoSerializer(houseList, many=True)
            print(serializer.data)
            return Response(
                {"houseList": serializer.data, "score": scoreList}, status=201
            )

