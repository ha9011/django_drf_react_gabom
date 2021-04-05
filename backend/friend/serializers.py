from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model
from chat.models import Chatting
from accounts.models import Profile

# from .models import ""
from django.conf import settings

User = get_user_model()


class FriendAvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["avatar", "introduce"]


class FriendListSerializer(serializers.ModelSerializer):
    pass


class SearchByPhoneSerializer(serializers.ModelSerializer):
    profile = FriendAvatarSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["pk", "name", "profile", "phone_number", "email", "gender"]


class SearchByIdSerializer(serializers.ModelSerializer):
    profile = FriendAvatarSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["pk", "name", "profile", "phone_number", "email", "gender"]


class ApplyListFromMeSerializer(serializers.ModelSerializer):
    profile = FriendAvatarSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["pk", "name", "profile", "phone_number", "email", "gender"]


class friendTotalInfoSerializer(serializers.ModelSerializer):
    profile = FriendAvatarSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["pk", "name", "profile", "phone_number", "email", "gender"]
