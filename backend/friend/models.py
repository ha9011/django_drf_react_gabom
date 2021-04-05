from django.db import models
from django.conf import settings

# Create your models here.
class FriendApplyList(models.Model):
    objects = models.Manager()

    userFrom = models.CharField(max_length=30)

    userTo = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name="appplyUserTo"
    )


class FriendList(models.Model):
    objects = models.Manager()
    userFrom = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="myFriends"
    )
    friend = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="friends")

