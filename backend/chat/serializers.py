from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model
from chat.models import Chatting

# from .models import ""
from django.conf import settings

User = get_user_model()


class ChattingSerializer(serializers.ModelSerializer):
    userId = serializers.CharField(write_only=True)
    message = serializers.CharField(write_only=True)
    planNo = serializers.CharField(write_only=True)

    class Meta:
        model = Chatting
        fields = (
            "message",
            "planNo",
            "userId",
        )

    def create(self, validated_data):
        print("create")
        print(validated_data)
        user = User.objects.get(pk=validated_data["userId"])
        chatting = Chatting.objects.create(
            user=user,
            planNo=validated_data["planNo"],
            message=validated_data["message"],
        )
        return chatting


class GetChattingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chatting
        fields = "__all__"

