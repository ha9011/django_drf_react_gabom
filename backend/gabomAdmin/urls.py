from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from . import views


urlpatterns = [
    path("notice/<int:pk>", views.NoticeAdminView.as_view(), name="admin_notice",),
    path("qna/<int:pk>", views.AdminQnaView.as_view(), name="admin_qna"),
    path("qantype/<int:postType>", views.AdminQnaTypeView.as_view(), name="admin_qna"),
    path(
        "qna-reple/<int:pk>", views.AdminQnaRepleView.as_view(), name="house_qna_reple"
    ),
    path("noticeAndQna/", views.AdminBoardView.as_view(), name="noticeAndQna"),
]
