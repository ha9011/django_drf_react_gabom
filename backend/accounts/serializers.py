from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password, check_password
from accounts.models import Profile
from django.db import transaction

User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    def validate_password(self, value):
        if len(value) < 4:
            raise ValidationError({"inputError": {"password": "비밀번호가 4글자 이상"}})
        return make_password(value)

    class Meta:
        model = User
        fields = [
            "pk",
            "username",
            "email",
            "password",
            "user_type",
            "name",
            "phone_number",
            "gender",
        ]

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create(**validated_data)
        Profile.objects.create(user=user, introduce=validated_data["username"] + "입니다.")
        return user


class userInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["name", "phone_number", "gender"]


class profileInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["avatar", "introduce"]


class UserProfileSerializer(serializers.ModelSerializer):
    user = userInfoSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ["user", "avatar", "introduce"]


class UserEditProfileSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="user.name")
    phone_number = serializers.CharField(source="user.phone_number")

    class Meta:
        model = Profile
        fields = ["name", "phone_number", "avatar", "introduce"]

    # instance : profile
    def update(self, instance, validated_data):
        print("...------------------------------------.")
        user_instance = instance.user
        user = User.objects.get(pk=user_instance.pk)
        user_data = validated_data.pop("user")

        user.name = user_data.get("name", user.name)
        user.phone_number = user_data.get("phone_number", user.phone_number)
        user.save()

        instance.user.name = user_data.get("name", instance.user.name)
        instance.user.phone_number = user_data.get(
            "phone_number", instance.user.phone_number
        )

        instance.avatar = validated_data.get("avatar", instance.avatar)
        instance.introduce = validated_data.get("introduce", instance.introduce)
        instance.save()
        return instance


class UserEditProfileBasicAvatarSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="user.name")
    phone_number = serializers.CharField(source="user.phone_number")
    avatar = serializers.CharField(default="public/basic.JPG")

    class Meta:
        model = Profile
        fields = ["name", "phone_number", "avatar", "introduce"]

    # instance : profile
    def update(self, instance, validated_data):
        print("...------------------------------------.")

        user_data = validated_data.pop("user")
        user_instance = instance.user
        user = User.objects.get(pk=user_instance.pk)
        user.name = user_data.get("name", user.name)
        user.phone_number = user_data.get("phone_number", user.phone_number)
        user.save()

        print(user_data)
        instance.avatar = "public/basic.JPG"
        instance.user.name = user_data.get("name", instance.user.name)
        instance.user.phone_number = user_data.get("phone_number")
        instance.introduce = validated_data.get("introduce", instance.introduce)
        instance.save()

        instance.avatar = "/media/public/basic.JPG"
        return instance


class UserEditProfileNotAvatarSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="user.name")
    phone_number = serializers.CharField(source="user.phone_number")

    class Meta:
        model = Profile
        fields = ["name", "phone_number", "introduce"]

    def update(self, instance, validated_data):
        print("...------------------------------------.")

        user_data = validated_data.pop("user")
        user_instance = instance.user
        user = User.objects.get(pk=user_instance.pk)
        user.name = user_data.get("name", user.name)
        user.phone_number = user_data.get("phone_number", user.phone_number)
        user.save()

        instance.user.name = user_data.get("name", instance.user.name)
        instance.user.phone_number = user_data.get(
            "phone_number", instance.user.phone_number
        )
        instance.introduce = validated_data.get("introduce", instance.introduce)
        instance.save()
        return instance

        # {'user': {'name': '하동원11', 'phone_number': '010744205971'},
        #  'avatar': <InMemoryUploadedFile: 캡처1.JPG (image/jpeg)>,
        # 'introduce': 'ha1입니다.1'}
        # user_instance = instance.user
        # print("--user--")

        # print(user_instance.pk)
        # user = User.objects.get(pk=user_instance.pk)

        # user_data = validated_data.pop("user")
        # print("-user_data--")
        # print(user_data)
        # print("-user_datazzz--")
        # print(user_data.get("name", user.name))
        # print(user_data.get("name"))
        # print(user.name)

        # user.name = user_data.get("name", user.name)
        # user.phone_number = user_data.get("phone_number", user.phone_number)
        # user.save()

        # print("gjgjgjgj")
        # print(user.name)
        # instance.name = user_data.get("name", user.name)
        # instance.phone_number = user_data.get("phone_number", user.phone_number)
        # instance.avatar = validated_data.get("avatar", instance.avatar)
        # instance.introduce = validated_data.get("introduce", instance.introduce)
        # instance.save()


class LoginUserInfoSerializer(serializers.ModelSerializer):
    profile = profileInfoSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["name", "user_type", "profile", "pk"]

