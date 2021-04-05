from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from . import views
from rest_framework_jwt.views import (
    obtain_jwt_token,
    refresh_jwt_token,
    verify_jwt_token,
)

urlpatterns = [
    # path("signupz/", views.SignupView.as_view(), name="signup"),
    path("signup/", views.SignupView.as_view(), name="signup"),
    path("user/", views.UserInfoView.as_view(), name="user"),
    path("userprofile/", views.UserProfileView.as_view(), name="userprofile"),
    path("login/token/", obtain_jwt_token),
    path("signup/refresh/", refresh_jwt_token),
    path("signup/verify/", verify_jwt_token),
    path("lost/", views.AccountLostView.as_view(), name="lost"),
    path("editPW/", views.EditPWView.as_view(), name="lost"),
]
