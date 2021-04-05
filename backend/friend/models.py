from django.db import models
from django.conf import settings

# Create your models here.

# 친구 요청 리스트
class FriendApplyList(models.Model):
    objects = models.Manager()
    # 신청자
    userFrom = models.CharField(max_length=30)
    # 신청 받은 자
    userTo = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name="appplyUserTo"
    )

# 친구 리스트
class FriendList(models.Model):
    objects = models.Manager()

    userFrom = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="myFriends"
    )
    friend = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="friends")

