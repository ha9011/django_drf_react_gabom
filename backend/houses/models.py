from django.db import models
from django.conf import settings
from plans.models import Plan

# Create your models here.


class Houseregist(models.Model):
    objects = models.Manager()

    houseId = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    houseName = models.CharField(max_length=20)
    houseAddress = models.CharField(max_length=40)
    houseDetailAddress = models.CharField(max_length=30)
    housePrice = models.CharField(max_length=10)
    houseType = models.CharField(max_length=10)
    maxPerson = models.CharField(max_length=10)
    rooms = models.CharField(max_length=2)
    xPoint = models.CharField(max_length=50)
    yPoint = models.CharField(max_length=50)
    mainImage = models.ImageField(upload_to="house/main/%Y/%m/%d")
    endDate = models.CharField(max_length=20)
    startDate = models.CharField(max_length=20)

    score = models.IntegerField(default=0, blank=True)

    like = models.IntegerField(default=0, blank=True)

    # 0 심사, 1 승인, 2거절
    is_active = models.IntegerField(default=0, blank=True)


class HouseRejectReaSon(models.Model):
    objects = models.Manager()
    houseregist = models.OneToOneField(
        Houseregist, on_delete=models.CASCADE, related_name="house_reject_reason"
    )
    content = models.TextField(default=0, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class HousedetaiiImage(models.Model):
    objects = models.Manager()
    houseRegist = models.ForeignKey(
        Houseregist, on_delete=models.CASCADE, related_name="housedetaiiImages"
    )
    detailImage = models.ImageField(upload_to="house/detail/%Y/%m/%d")

    def __str__(self):
        return f"{self.detailImage}"


class HouseNoticeBoard(models.Model):
    objects = models.Manager()
    house = models.ForeignKey(
        Houseregist, on_delete=models.CASCADE, related_name="house_notice_board"
    )
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class HouseQnaBoard(models.Model):
    objects = models.Manager()
    house = models.ForeignKey(
        Houseregist, on_delete=models.CASCADE, related_name="house_qna_board"
    )
    title = models.CharField(max_length=100)
    content = models.TextField()
    public = models.BooleanField(default=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="user_house_qna",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class HouseQnaRepleBoard(models.Model):
    objects = models.Manager()

    houseqnaboard = models.ForeignKey(
        HouseQnaBoard, on_delete=models.CASCADE, related_name="house_qna_board_reple"
    )

    content = models.TextField()

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="user_house_qna_reple",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class HouseReservationBoard(models.Model):
    objects = models.Manager()
    house = models.ForeignKey(
        Houseregist, on_delete=models.CASCADE, related_name="house_reservation"
    )
    reservation_sdate = models.CharField(max_length=100)
    reservation_edate = models.CharField(max_length=100)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="house_reservation_user",
    )
    plan = models.ForeignKey(
        Plan, on_delete=models.CASCADE, related_name="house_reservation_plan",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = (("house", "reservation_sdate", "reservation_edate", "plan"),)


class HouseLike(models.Model):
    objects = models.Manager()
    house = models.ForeignKey(
        Houseregist, on_delete=models.CASCADE, related_name="house_like"
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="house_like_user",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = (("house", "user"),)


class HouseScore(models.Model):
    objects = models.Manager()

    reservation = models.OneToOneField(
        HouseReservationBoard,
        on_delete=models.CASCADE,
        related_name="house_score_reservation",
    )

    house = models.ForeignKey(
        Houseregist, on_delete=models.CASCADE, related_name="house_score"
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="house_score_user",
    )
    score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = (("house", "user"),)

