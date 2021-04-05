from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from .models import AdminNoticeBoard, AdminQnaBoard, AdminQnaRepleBoard
from .serializers import (
    AdminNoticeSerializer,
    AdminQnaSerializer,
    AdminQnaRepleSerializer,
)

User = get_user_model()


class NoticeAdminView(APIView):
    def get(self, request, pk):
        notice_admin = AdminNoticeBoard.objects.all()

        serializer = AdminNoticeSerializer(notice_admin)
        return Response(serializer.data, status=201)

    def post(self, request, pk):
        print("keyword : " + str(pk))
        print("request.data : ")
        print(request.data)
        title = request.data["content"]["title"]
        content = request.data["content"]["content"]

        notice_admin = AdminNoticeBoard.objects.create(title=title, content=content)

        serializer = AdminNoticeSerializer(notice_admin)
        print(serializer.data)

        return Response(serializer.data, status=201)

    def put(self, request, pk):
        print("update : " + str(pk))
        print("request.data : ")
        print(request.data)
        title = request.data["content"]["title"]
        content = request.data["content"]["content"]

        print("1")

        print("2")
        update_count = AdminNoticeBoard.objects.filter(id=pk).update(
            title=title, content=content
        )
        notice_admin = AdminNoticeBoard.objects.all()
        print("3")

        serializer = AdminNoticeSerializer(notice_admin, many=True)
        print(serializer.data)

        return Response(serializer.data, status=201)

    def delete(self, request, pk):
        print("update : " + str(pk))

        AdminNoticeBoard.objects.filter(id=pk).delete()

        return Response(pk, status=201)


class AdminQnaView(APIView):
    def post(self, request, pk):
        print("keyword : " + str(pk))
        print("request.data : ")
        print(request.data)

        title = request.data["content"]["title"]
        content = request.data["content"]["content"]
        public = request.data["content"]["public"]

        qna_admin = AdminQnaBoard.objects.create(
            title=title, content=content, public=public, user=request.user,
        )

        serializer = AdminQnaSerializer(qna_admin)
        print(serializer.data)

        return Response(serializer.data, status=201)

    def put(self, request, pk):
        print("update : " + str(pk))
        print("request.data : ")
        print(request.data)
        title = request.data["content"]["title"]
        content = request.data["content"]["content"]
        public = request.data["content"]["public"]

        print("1")

        print("2")
        qna_admin = AdminQnaBoard.objects.filter(id=pk).update(
            title=title, content=content, public=public
        )
        print("3")
        qna_admin = AdminQnaBoard.objects.all()
        serializer = AdminQnaSerializer(qna_admin, many=True)
        print(serializer.data)

        return Response(serializer.data, status=201)

    def delete(self, request, pk):
        print("update : " + str(pk))

        AdminQnaBoard.objects.filter(id=pk).delete()

        return Response(pk, status=201)


class AdminQnaRepleView(APIView):
    def get(self, request, pk):
        print("get HouseQnaRepleView : " + str(pk))

        adminqnaboard = get_object_or_404(AdminQnaBoard, pk=pk)
        print(adminqnaboard)
        qna_reple = AdminQnaRepleBoard.objects.filter(adminqnaboard=adminqnaboard)
        print(qna_reple)
        serializer = AdminQnaRepleSerializer(qna_reple, many=True)
        print(serializer.data)

        return Response(serializer.data, status=201)

    def post(self, request, pk):
        print("houseId : " + str(pk))
        print("request.data : ")
        print(request.data)

        content = request.data["content"]

        user = User.objects.get(pk=request.user.pk)
        adminqnaboard = get_object_or_404(AdminQnaBoard, pk=pk)
        qna_reple = AdminQnaRepleBoard.objects.create(
            adminqnaboard=adminqnaboard, content=content, user=user
        )

        serializer = AdminQnaRepleSerializer(qna_reple)
        print(serializer.data)

        return Response(serializer.data, status=201)

    def put(self, request, pk):
        print("update HouseQnaRepleView : " + str(pk))
        print("request.data : ")
        print(request.data)

        content = request.data["content"]

        print("2")
        qna_house_reple = AdminQnaRepleBoard.objects.filter(id=pk).update(
            content=content
        )

        print("success")
        return Response("", status=201)

    def delete(self, request, pk):
        print("update : " + str(pk))

        AdminQnaRepleBoard.objects.filter(id=pk).delete()

        return Response(pk, status=201)


class AdminBoardView(APIView):
    def get(self, request):
        print("== AdminBoardView ")
        print(1)
        notice_admin = AdminNoticeBoard.objects.all()
        print(notice_admin)
        print(2)
        noticeSerializer = AdminNoticeSerializer(notice_admin, many=True)
        print(3)
        qna_admin = AdminQnaBoard.objects.all()
        print(qna_admin)
        print(4)
        qnAserializer = AdminQnaSerializer(qna_admin, many=True)
        print(5)
        return Response(
            {"notice": noticeSerializer.data, "qna": qnAserializer.data}, status=201
        )


class AdminQnaTypeView(APIView):
    def get(self, request, postType):
        print("== AdminBoardView " + str(postType))

        if postType == 0:
            qna_admin = AdminQnaBoard.objects.filter(user=request.user)
            qnAserializer = AdminQnaSerializer(qna_admin, many=True)
            return Response(qnAserializer.data, status=201)
        else:
            qna_admin = AdminQnaBoard.objects.all()
            qnAserializer = AdminQnaSerializer(qna_admin, many=True)
            return Response(qnAserializer.data, status=201)
