from django.shortcuts import render
from rest_framework.permissions import AllowAny
from .serializers import (
    SignupSerializer,
    UserProfileSerializer,
    UserEditProfileSerializer,
    UserEditProfileBasicAvatarSerializer,
    UserEditProfileNotAvatarSerializer,
    LoginUserInfoSerializer,
)
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from accounts.models import Profile
from rest_framework.decorators import api_view, permission_classes
from .sendEmial import send_email
from backend.settings.my_settings import smtp_info
from email.mime.text import MIMEText
from django.contrib.auth.hashers import make_password, check_password
import random


class SignupView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):
        formData = request.data
        print(formData)

        if formData["password"] != formData["cPassword"]:
            print("비밀번호가 다름")
            return Response({"inputError": {"password": "비밀번호가 다릅니다"}}, status=400)

        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class UserInfoView(APIView):
    def get(self, request):

        User = get_user_model()
        user = User.objects.get(pk=request.user.pk)
        serializer = LoginUserInfoSerializer(user)

        print("------")
        print(serializer.data)
        return Response(serializer.data, status=201,)


class UserProfileView(APIView):
    def get(self, request):
        User = get_user_model()
        user = User.objects.get(pk=request.user.pk)
        print("---------profile")
        print(request.user.pk)
        print(user)
        print(user.profile)
        serializer = UserProfileSerializer(user.profile)
        return Response(serializer.data, status=201)

    def patch(self, request):
        formData = request.data
        print("--formData--")
        print(formData["avatar"])

        if formData["img"] == "0":
            print("..............00")
            User = get_user_model()
            user = User.objects.get(pk=request.user.pk)
            profile = user.profile
            serializer = UserEditProfileNotAvatarSerializer(
                instance=profile, data=formData
            )
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                print("--serializer.data--")
                print(serializer.data)
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)
        elif formData["img"] == "1":
            print("..............11")
            User = get_user_model()
            user = User.objects.get(pk=request.user.pk)
            profile = user.profile

            print("..............qwewqewqe")
            serializer = UserEditProfileBasicAvatarSerializer(
                instance=profile, data=formData
            )
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                print("--serializer.data--")
                print(serializer.data)
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)
        else:
            User = get_user_model()
            user = User.objects.get(pk=request.user.pk)
            profile = user.profile
            serializer = UserEditProfileSerializer(instance=profile, data=formData)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                print("--serializer.data--")
                print(serializer.data)
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)

        # return Response( status=201)


class AccountLostView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):
        print("==get AccountLostView==")
        formData = request.data
        # {'checkType': '2', 'username': '1', 'name': '1', 'email': '1@qwe.qwe', 'phone_number': '1'}
        checkType = request.data["checkType"]
        userId = request.data.get("username", "")
        name = request.data["name"]
        email = request.data["email"]
        phone_number = request.data["phone_number"]

        User = get_user_model()
        print(formData)

        if checkType == "1":
            user = User.objects.filter(
                name=name, email=email, phone_number=phone_number
            )

            if user.exists() == True:
                return Response(
                    {"msg": f"찾으시는 아이디는 {user[0].username} 입니다."}, status=201
                )
            else:
                return Response({"msg": "해당하는 아이디가 없습니다. 다시 확인해주세요"}, status=201)
        elif checkType == "2":
            user = User.objects.filter(
                username=userId, name=name, email=email, phone_number=phone_number
            )

            if user.exists() == True:
                # 메일 내용 작성
                user = User.objects.get(
                    username=userId, name=name, email=email, phone_number=phone_number
                )
                user_email = user.email
                user_name = user.name
                new_pw = str(random.randrange(1000, 9999))
                user.password = make_password(new_pw)
                user.save()

                print("====정보정보===")
                print(user_email)
                print(user_name)
                print(new_pw)

                title = f"{user_name}님 안녕하세요. 비밀번호 안내 메일 입니다."
                content = f"임시비밀번호가 [{new_pw}]로 변경되었습니다. 로그인 후 변경을 반드시 해주세요 "
                sender = "ha90111@naver.com"
                receiver = str(user_email)
                msg = MIMEText(_text=content, _charset="utf-8")  # 메일 내용

                msg["Subject"] = title  # 메일 제목
                msg["From"] = sender  # 송신자
                msg["To"] = receiver  # 수신자

                result = send_email(smtp_info, msg)
                if result:
                    return Response({"msg": "이메일로 임시 비밀번호가 전달되었습니다."}, status=201)
                else:
                    return Response({"msg": "..."}, status=201)
            else:
                return Response({"msg": "정보가 일치 하지 않습니다. 다시 확인해주세요"}, status=201)

        return Response({"msg": "오류"}, status=400)


class EditPWView(APIView):
    def put(self, request):
        pw = request.data["pw"]
        cpw = request.data["cpw"]
        # ccpw = request.data["ccpw"]
        User = get_user_model()
        user = request.user

        print(pw)
        print(cpw)
        print(user)
        print(user.password)
        check = check_password(str(pw), user.password)
        if check:
            user.password = make_password(cpw)
            user.save()
            return Response({"msg": True}, status=201)
        else:

            return Response({"msg": False}, status=201)

