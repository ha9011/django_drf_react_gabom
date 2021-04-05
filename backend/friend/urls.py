from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from . import views


urlpatterns = [
    path("", views.FriendTotlaInfo.as_view(), name="FriendTotlaInfo"),
    path("save/", views.FriendListView.as_view(), name="friend"),
    path("search/p/<str:phone>", views.SearchByPhone.as_view(), name="searchphone"),
    path("search/i/<str:id>", views.SearchById.as_view(), name="searchid"),
    path("apply/", views.ApplyById.as_view(), name="applyFriend"),
    path("applyCancel/", views.ApplyCancelById.as_view(), name="applyCancel"),
    path("appliedReject/", views.AppliedReject.as_view(), name="applyCancel"),
    path("appliedAgree/", views.AppliedAgree.as_view(), name="applyCancel"),
    path("delete/", views.FriendDelete.as_view(), name="friendDelete"),
]
