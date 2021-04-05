from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from accounts.models import Profile
from django.db import transaction
from .models import (
    Plan,
    PlanDate,
    DetailPlan,
    PlanMember,
    SharePlan,
    ShareDetail,
    SharePlanDate,
    ShareScore,
)
from friend.models import FriendList
from chat.models import Chatting
from houses.models import HouseReservationBoard

User = get_user_model()


class profileInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["avatar", "introduce"]


class LoginUserInfoSerializer(serializers.ModelSerializer):
    profile = profileInfoSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["pk", "name", "user_type", "profile"]


class FriendInfoSerializer(serializers.ModelSerializer):
    friend = LoginUserInfoSerializer(read_only=True, many=True)

    class Meta:
        model = FriendList
        fields = ["friend"]


class NoMemberFriendInfoSerializer(serializers.ModelSerializer):
    userFrom = LoginUserInfoSerializer(read_only=True)

    class Meta:
        model = FriendList
        fields = ["userFrom"]


# 친구 리스트
class FriendListSerializer(serializers.ModelSerializer):
    myFriends = FriendInfoSerializer(read_only=True, many=True)

    class Meta:
        model = User
        fields = ["myFriends"]


class DetailPlanDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetailPlan
        fields = "__all__"


class PlanMemberSerializer(serializers.ModelSerializer):
    user = LoginUserInfoSerializer(read_only=True)

    class Meta:
        model = PlanMember
        fields = ["plan", "state", "user", "complete"]


class DetailPlanDateSaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetailPlan
        fields = [
            "move_turn",
            "detail_img",
            "place_name",
            "place_location",
            "place_x",
            "place_y",
            "place_memo",
            "place_type",
            "house_id",
            "reservation_id",
        ]


class PlanDateSerializer(serializers.ModelSerializer):
    detailPlace = DetailPlanDateSerializer(many=True, read_only=True)

    class Meta:
        model = PlanDate
        fields = [
            "plan_id",
            "pk",
            "date",
            "nth_day",
            "detailPlace",
        ]


class MakePlanSerializer(serializers.ModelSerializer):
    schedule = PlanDateSerializer(many=True, write_only=True)
    complete = serializers.CharField(write_only=True)

    class Meta:
        model = Plan
        fields = [
            "id",
            "plan_title",
            "start_date",
            "end_date",
            "schedule",
            "is_share",
            "share",
            "location",
            "areacode",
            "complete",
        ]

    def create(self, validated_data):
        print("create")
        print(validated_data["plan_title"])
        plan = Plan.objects.create(
            user_id=validated_data["pk"],
            plan_title=validated_data["plan_title"],
            start_date=validated_data["start_date"],
            end_date=validated_data["end_date"],
            location=validated_data["location"],
            areacode=validated_data["areacode"],
        )
        print("plan save ok")
        print(plan.pk)
        print("planMemeber start ")
        print(validated_data)
        user = User.objects.get(id=validated_data["pk"])

        PlanMember.objects.create(
            user=user, plan=plan, state="1", complete=validated_data["complete"]
        )

        print("planmember save ok")

        dateList = validated_data["schedule"]
        print("dateList")
        print(dateList)
        count = 1
        for date in dateList:
            print("count 번째 만들고 있습니다. : " + str(count))

            PlanDate.objects.create(plan=plan, **date)
            count += 1

        return plan


class PlanListInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = "__all__"


class PlanListSerializer(serializers.ModelSerializer):
    plan = PlanListInfoSerializer(read_only=True)

    class Meta:
        model = PlanMember
        fields = [
            "plan",
        ]


class PlanChoiceSerializer(serializers.ModelSerializer):
    schedule = PlanDateSerializer(many=True, read_only=True)
    # member = PlanMemberSerializer(many=True, read_only=True)
    # user = FriendListSerializer(read_only=True)

    class Meta:
        model = Plan

        fields = [
            "pk",
            "plan_title",
            "start_date",
            "end_date",
            "schedule",
            "is_share",
            "share",
            "location",
            "areacode",
            #  "member",
            "user",
        ]


class DetailDatePlanSerializer(serializers.ModelSerializer):
    detailPlace = DetailPlanDateSaveSerializer(many=True, write_only=True)
    pk = serializers.CharField(source="PlanDate.plan_date_id", write_only=True)
    date = serializers.CharField(source="PlanDate.date", write_only=True)
    nth_day = serializers.CharField(source="PlanDate.nth_day", write_only=True)
    plan_id = PlanListInfoSerializer(read_only=True)

    class Meta:
        model = PlanDate
        fields = ["pk", "detailPlace", "date", "nth_day", "plan_id"]

    def validate(self, data):
        print("validate")
        print(data)
        return data

    def create(self, validated_data):
        print("==create==")
        print(validated_data)
        schedules = self.context["obj"]["schedule"]
        print(schedules)

        for i in schedules:
            print("==schedules==")
            date_pk = i["pk"]
            detailPlaces = i["detailPlace"]

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
                    plan_date=date_pk,
                    place_type=j["place_type"],
                    house_id=j["house_id"],
                    reservation_id=j["reservation_id"],
                )
        # print(validated_data["PlanDate"]["plan_date_id"])
        # print("==========0")

        # # plan = Plan.objects.create(
        # #     user_id=validated_data["pk"],
        # #     plan_title=validated_data["plan_title"],
        # #     start_date=validated_data["start_date"],
        # #     end_date=validated_data["end_date"],
        # #     location=validated_data["location"],
        # #     areacode=validated_data["areacode"],
        # # )
        # # print("plan save ok")
        # # dateList = validated_data["schedule"]
        # # print("dateList")
        # # print(dateList)
        # returnList = []
        # for date in validated_data["detailPlace"]:
        #     print("===date===")
        #     print(date)
        #     # 숙소 일 경우
        #     # "house", "reservation_date", "plan"
        #     if date.get("place_type") == None:
        #         date["place_type"] = 0

        #     if date.get("house_id") == None:
        #         date["house_id"] = 0
        #         # detailPlan = HouseReservationBoard.objects.filter(
        #         #     house=date["house_id"],
        #         #     plan=plan,
        #         #     reservation_date=validated_data["PlanDate"]["date"],
        #         # )
        #         # detailPlan.delete()

        #     DetailPlan.objects.create(
        #         move_turn=date["move_turn"],
        #         detail_img=date["detail_img"],
        #         place_name=date["place_name"],
        #         place_location=date["place_location"],
        #         place_x=date["place_x"],
        #         place_y=date["place_y"],
        #         place_memo=date["place_memo"],
        #         plan_date_id=validated_data["PlanDate"]["plan_date_id"],
        #         place_type=date["place_type"],
        #         house_id=date["house_id"],
        #     )

        # return returnList


class GetChattingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chatting
        fields = "__all__"


class SharePlanListInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SharePlan
        fields = "__all__"


class ShareDetailPlanInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShareDetail
        fields = "__all__"


class ShareDatePlanInfoSerializer(serializers.ModelSerializer):
    share_detailPlace = ShareDetailPlanInfoSerializer(read_only=True, many=True)

    class Meta:
        model = SharePlanDate
        fields = [
            "pk",
            "nth_day",
            "share_detailPlace",
        ]


class SharePlanInfoSerializer(serializers.ModelSerializer):
    share_schedule = ShareDatePlanInfoSerializer(read_only=True, many=True)

    class Meta:
        model = SharePlan
        fields = [
            "pk",
            "plan_title",
            "recommend",
            "share",
            "location",
            "range_date",
            "share_schedule",
            "areacode",
        ]


class ShareAvgScorePlanInfoSerializer(serializers.ModelSerializer):
    share_plan = SharePlanInfoSerializer(read_only=True)
    score_average = serializers.CharField(read_only=True)

    class Meta:
        model = ShareScore
        fields = [
            "share_plan",
            "score_average",
        ]

