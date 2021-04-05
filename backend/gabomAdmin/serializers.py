from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model
from .models import AdminNoticeBoard, AdminQnaBoard, AdminQnaRepleBoard

# from .models import ""
from django.conf import settings
from accounts.models import Profile

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


class AdminNoticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminNoticeBoard

        fields = [
            "id",
            "content",
            "title",
            "created_at",
            "updated_at",
        ]


class AdminQnaSerializer(serializers.ModelSerializer):
    user = LoginUserInfoSerializer(read_only=True)

    class Meta:
        model = AdminQnaBoard

        fields = [
            "pk",
            "user",
            "public",
            "content",
            "title",
            "created_at",
            "updated_at",
        ]


class AdminQnaRepleSerializer(serializers.ModelSerializer):
    user = LoginUserInfoSerializer(read_only=True)
    adminqnaboard = AdminQnaSerializer(read_only=True)

    class Meta:
        model = AdminQnaRepleBoard

        fields = [
            "pk",
            "adminqnaboard",
            "content",
            "user",
            "created_at",
            "updated_at",
        ]

