from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model
from .models import (
    HousedetaiiImage,
    Houseregist,
    HouseNoticeBoard,
    HouseQnaBoard,
    HouseQnaRepleBoard,
    HouseReservationBoard,
)
from django.conf import settings
from plans.models import DetailPlan, PlanDate
from accounts.models import Profile
from django.db.models import Avg, Count

User = get_user_model()


class profileInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["avatar", "introduce"]


class LoginUserInfoSerializer(serializers.ModelSerializer):
    profile = profileInfoSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["pk", "name", "user_type", "profile", "phone_number"]


class HouseRegistDetailImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HousedetaiiImage
        fields = "__all__"


class noticeBoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = HouseNoticeBoard
        fields = "__all__"


class HouseMainInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Houseregist

        fields = (
            "pk",
            "houseId",
            "houseName",
            "houseAddress",
            "houseDetailAddress",
            "housePrice",
            "houseType",
            "maxPerson",
            "rooms",
            "xPoint",
            "yPoint",
            "mainImage",
            "endDate",
            "startDate",
            "is_active",
        )


class HouseRegistSerializer(serializers.ModelSerializer):
    detailImage = HouseRegistDetailImageSerializer(many=True, read_only=True)

    class Meta:
        model = Houseregist

        fields = (
            "pk",
            "houseId",
            "houseName",
            "houseAddress",
            "houseDetailAddress",
            "housePrice",
            "houseType",
            "maxPerson",
            "rooms",
            "xPoint",
            "yPoint",
            "mainImage",
            "endDate",
            "startDate",
            "detailImage",
            "is_active",
        )

    def create(self, validated_data):
        images_data = self.context["request"].FILES
        houseRegist = Houseregist.objects.create(**validated_data)
        for image_data in images_data.getlist("detailImage"):
            HousedetaiiImage.objects.create(
                houseRegist=houseRegist, detailImage=image_data
            )
        return houseRegist

    def update(self, instance, validated_data):
        print("==update==")
        images_data = self.context["request"].FILES
        print("=1=")
        print(images_data)

        print(instance)
        # instance.houseId = validated_data.get("houseId", instance.houseId)
        instance.houseName = validated_data.get("houseName", instance.houseName)
        instance.houseAddress = validated_data.get(
            "houseAddress", instance.houseAddress
        )
        instance.houseDetailAddress = validated_data.get(
            "houseDetailAddress", instance.houseDetailAddress
        )
        instance.housePrice = validated_data.get("housePrice", instance.housePrice)
        instance.houseType = validated_data.get("houseType", instance.houseType)
        instance.maxPerson = validated_data.get("maxPerson", instance.maxPerson)
        instance.rooms = validated_data.get("rooms", instance.rooms)
        instance.xPoint = validated_data.get("xPoint", instance.xPoint)
        instance.yPoint = validated_data.get("yPoint", instance.yPoint)
        instance.mainImage = validated_data.get("mainImage", instance.mainImage)
        instance.endDate = validated_data.get("endDate", instance.endDate)
        instance.startDate = validated_data.get("startDate", instance.startDate)
        instance.is_active = validated_data.get("is_active", 0)
        instance.save()
        if len(images_data.getlist("detailImage")) > 0:
            print("--기존 이미지 삭제")
            # 기존 이미지 삭제
            HousedetaiiImage.objects.filter(houseRegist=instance).delete()

            # 디테일 이미지 재등록
            print("--디테일 이미지 재등록")
            for image_data in images_data.getlist("detailImage"):
                HousedetaiiImage.objects.create(
                    houseRegist=instance, detailImage=image_data
                )

        return instance


class HouseQnaSerializer(serializers.ModelSerializer):
    user = LoginUserInfoSerializer(read_only=True)

    class Meta:
        model = HouseQnaBoard

        fields = [
            "pk",
            "user",
            "public",
            "house",
            "content",
            "title",
            "created_at",
            "updated_at",
        ]


class HouseQnaRepleSerializer(serializers.ModelSerializer):
    user = LoginUserInfoSerializer(read_only=True)
    houseqnaboard = HouseQnaSerializer(read_only=True)

    class Meta:
        model = HouseQnaRepleBoard

        fields = [
            "pk",
            "houseqnaboard",
            "content",
            "user",
            "created_at",
            "updated_at",
        ]


class HouseInfoSerializer(serializers.ModelSerializer):
    housedetaiiImages = serializers.StringRelatedField(many=True)
    house_notice_board = noticeBoardSerializer(read_only=True, many=True)
    house_qna_board = HouseQnaSerializer(read_only=True, many=True)

    class Meta:
        model = Houseregist

        fields = [
            "pk",
            "houseId",
            "houseName",
            "houseAddress",
            "houseDetailAddress",
            "housePrice",
            "houseType",
            "maxPerson",
            "rooms",
            "xPoint",
            "yPoint",
            "mainImage",
            "endDate",
            "startDate",
            "is_active",
            "housedetaiiImages",
            "house_notice_board",
            "house_qna_board",
            "house_like",
            "house_score",
            "like",
        ]


class HouseNoticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = HouseNoticeBoard

        fields = [
            "id",
            "house",
            "content",
            "title",
            "created_at",
            "updated_at",
        ]


class ReservationDetailPlanSerializer(serializers.Serializer):

    date = serializers.CharField(write_only=True)
    planId = serializers.CharField(write_only=True)
    nextMove = serializers.CharField(write_only=True)
    planDateId = serializers.CharField(write_only=True)

    def validate(self, data):
        print("validate")
        print(data)
        return data

    # instance : profile
    def update(self, instance, validated_data):
        print("...-----------------------z-------------.")
        house_id = instance.pk
        y_point = instance.yPoint
        x_point = instance.xPoint
        houseName = instance.houseName
        houseAddress = instance.houseAddress + instance.houseDetailAddress
        houseImg = "http://localhost:8000/media/public/home.png"
        reserId = self.context["reserId"]
        reservation_range = self.context["reservation_range"]
        planId = validated_data["planId"]

        print("==qwe")
        print(reserId)
        print(reservation_range)
        for i in reservation_range:
            rdate = i["date"]
            nth_day = i["nth_day"]
            plan_date = PlanDate.objects.get(plan=planId, nth_day=nth_day)
            next_nth = DetailPlan.objects.filter(plan_date=plan_date).count()
            detail_plan = DetailPlan.objects.create(
                plan_date=plan_date,
                move_turn=int(next_nth) + 1,
                detail_img=houseImg,
                place_name=houseName,
                place_location=houseAddress,
                place_x=x_point,
                place_y=y_point,
                place_type="1",
                house_id=house_id,
                reservation_id=reserId,
            )
        print("--end create--")
        return detail_plan


class RecoReservationDetailPlanSerializer(serializers.Serializer):

    date = serializers.CharField(write_only=True)
    planId = serializers.CharField(write_only=True)
    nextMove = serializers.CharField(write_only=True)
    planDateId = serializers.CharField(write_only=True)

    def validate(self, data):
        print("validate")
        print(data)
        return data

    # instance : profile
    def update(self, instance, validated_data):
        print("...-----------------------z-------------.")
        house_id = instance.pk
        y_point = instance.yPoint
        x_point = instance.xPoint
        houseName = instance.houseName
        houseAddress = instance.houseAddress + instance.houseDetailAddress
        houseImg = "http://localhost:8000/media/public/home.png"
        reserId = self.context["reserId"]
        prev_reserId = self.context["reservation_id"]  # 추천 때 가져오는 이전 예약번호
        reservation_range = self.context["reservation_range"]
        planId = validated_data["planId"]

        print("==qwe")
        print(reserId)
        print(reservation_range)
        for i in reservation_range:
            rdate = i["date"]
            nth_day = i["nth_day"]
            plan_date = PlanDate.objects.get(plan=planId, nth_day=nth_day)
            check = DetailPlan.objects.filter(
                plan_date=plan_date,
                house_id=house_id,
                reservation_id=prev_reserId,
                place_type="2",
            )

            if check:
                print("== 존재 업데이트 ==")
                dp = DetailPlan.objects.get(
                    plan_date=plan_date,
                    house_id=house_id,
                    reservation_id=prev_reserId,
                    place_type="2",
                )

                dp.place_type = "1"
                dp.reservation_id = reserId
                dp.save()
            else:
                print("== 존재X 생성 ==")
                next_nth = DetailPlan.objects.filter(plan_date=plan_date).count()
                detail_plan = DetailPlan.objects.create(
                    plan_date=plan_date,
                    move_turn=int(next_nth) + 1,
                    detail_img=houseImg,
                    place_name=houseName,
                    place_location=houseAddress,
                    place_x=x_point,
                    place_y=y_point,
                    place_type="1",
                    house_id=house_id,
                    reservation_id=reserId,
                )
        print("--end create--")
        return detail_plan


class ReservationCountSerializer(serializers.Serializer):
    reservation_date = serializers.CharField(read_only=True)
    count = serializers.CharField(read_only=True)


class ReservationUserListSerializer(serializers.ModelSerializer):
    user = LoginUserInfoSerializer(read_only=True)

    class Meta:
        model = HouseReservationBoard

        fields = ["user"]


class ReservationBookListSerializer(serializers.ModelSerializer):
    house = HouseMainInfoSerializer(read_only=True)

    class Meta:
        model = HouseReservationBoard

        fields = ["pk", "reservation_sdate", "reservation_edate", "plan", "house"]

