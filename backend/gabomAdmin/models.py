from django.db import models
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin


class AdminNoticeBoard(models.Model):
    objects = models.Manager()

    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class AdminQnaBoard(models.Model):
    objects = models.Manager()

    title = models.CharField(max_length=100)
    content = models.TextField()
    public = models.BooleanField(default=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="user_admin_qna",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class AdminQnaRepleBoard(models.Model):
    objects = models.Manager()

    adminqnaboard = models.ForeignKey(
        AdminQnaBoard, on_delete=models.CASCADE, related_name="admin_qna_board_reple"
    )

    content = models.TextField()

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="admin_house_qna_reple",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
