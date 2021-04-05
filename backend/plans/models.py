from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.conf import settings


class Plan(models.Model):
    objects = models.Manager()
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="createUser"
    )
    # 제목
    plan_title = models.CharField(max_length=30)
    # 공유 여부 (0 - 아무상태 아님, 1- 공유상태)
    is_share = models.BooleanField(default=False)
    # 공유된 아이디
    share_id = models.IntegerField(default=0, blank=True)
    # 심사 상태 1-대기 2-승인 3-거절
    share = models.IntegerField(default=0, blank=True)
    location = models.CharField(max_length=30, blank=True)
    areacode = models.CharField(max_length=2, blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


# 여행 거절 이유
class PlanRejectReaSon(models.Model):
    objects = models.Manager()
    plan = models.OneToOneField(
        Plan, on_delete=models.CASCADE, related_name="reject_reason"
    )
    content = models.TextField(default=0, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


# 여행 맴버
class PlanMember(models.Model):
    objects = models.Manager()
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE, related_name="member")
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="userInfo"
    )
    state = models.CharField(max_length=2, blank=True)
    complete = models.CharField(max_length=2, blank=True)

    class Meta:
        unique_together = (("plan", "user"),)


# 여행 날짜
class PlanDate(models.Model):
    objects = models.Manager()
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE, related_name="schedule")
    date = models.DateField()
    nth_day = models.CharField(max_length=2)

    class Meta:
        ordering = [
            "nth_day",
        ]


# 여행 디테일
class DetailPlan(models.Model):
    objects = models.Manager()
    plan_date = models.ForeignKey(
        PlanDate, on_delete=models.CASCADE, related_name="detailPlace"
    )
    move_turn = models.IntegerField()
    detail_img = models.CharField(max_length=200)
    place_name = models.CharField(max_length=20)
    place_location = models.CharField(max_length=100)
    place_x = models.CharField(max_length=100)
    place_y = models.CharField(max_length=100)
    place_memo = models.TextField(default="", blank=True)
    # 여행지 0 , 숙소 1
    place_type = models.CharField(max_length=1, default="0", blank=True)
    house_id = models.CharField(max_length=10, default="0", blank=True)
    reservation_id = models.CharField(max_length=10, default="0", blank=True)

    class Meta:
        ordering = [
            "move_turn",
        ]


class SharePlan(models.Model):
    objects = models.Manager()
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="share_createUser",
    )
    plan = models.OneToOneField(
        Plan, on_delete=models.SET_NULL, related_name="paln_share", null=True
    )
    plan_title = models.CharField(max_length=30)

    recommend = models.IntegerField(default=0, blank=True)

    share = models.IntegerField(default=0, blank=True)
    location = models.CharField(max_length=30, blank=True)
    areacode = models.CharField(max_length=2, blank=True)
    range_date = models.IntegerField(default=0, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class SharePlanDate(models.Model):
    objects = models.Manager()
    share_plan = models.ForeignKey(
        SharePlan, on_delete=models.CASCADE, related_name="share_schedule"
    )

    nth_day = models.CharField(max_length=2)

    class Meta:
        ordering = [
            "nth_day",
        ]


class ShareDetail(models.Model):
    objects = models.Manager()
    share_plan_date = models.ForeignKey(
        SharePlanDate, on_delete=models.CASCADE, related_name="share_detailPlace"
    )
    move_turn = models.IntegerField()
    detail_img = models.CharField(max_length=200)
    place_name = models.CharField(max_length=20)
    place_location = models.CharField(max_length=100)
    place_x = models.CharField(max_length=100)
    place_y = models.CharField(max_length=100)

    # 여행지 0 , 숙소 1, 추천 숙소 2
    place_type = models.CharField(max_length=1, default="0", blank=True)
    house_id = models.CharField(max_length=10, default="0", blank=True)
    reservation_id = models.CharField(max_length=10, default="0", blank=True)

    class Meta:
        ordering = [
            "move_turn",
        ]


class ShareScore(models.Model):
    objects = models.Manager()
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="share_score_user",
    )
    plan = models.OneToOneField(
        Plan, on_delete=models.CASCADE, related_name="share_score_plan",
    )
    share_plan = models.ForeignKey(
        SharePlan, on_delete=models.SET_NULL, related_name="share_paln_score", null=True
    )
    score = models.IntegerField(default=0, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
