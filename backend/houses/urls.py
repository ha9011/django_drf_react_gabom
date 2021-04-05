from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from . import views


urlpatterns = [
    # path("signupz/", views.SignupView.as_view(), name="signup"),
    path("houseinfo/", views.HouseRegistView.as_view(), name="houseinfo"),
    path("housebyid/<int:pk>", views.HouseByIdView.as_view(), name="housebyid"),
    path(
        "housebyid/<int:pk>/<int:search>",
        views.HouseByIdAndDateView.as_view(),
        name="housebyid",
    ),
    path("search/<str:keyword>", views.HouseSearchView.as_view(), name="houseSearch"),
    path("notice/<int:pk>", views.HouseNoticeView.as_view(), name="housenotice"),
    path("qna/<int:pk>", views.HouseQnaView.as_view(), name="house_qna"),
    path(
        "qna-reple/<int:pk>", views.HouseQnaRepleView.as_view(), name="house_qna_reple"
    ),
    path(
        "reservaion/<int:houseId>",
        views.HouseReservationView.as_view(),
        name="housereservation",
    ),
    path("house-like/<int:pk>", views.HouseLikeView.as_view(), name="house_qna"),
    path(
        "calendar-count/<str:smonth>/<str:emonth>/<int:pk>",
        views.HouseReservationCountView.as_view(),
        name="house_count",
    ),
    path(
        "calendar-reservate/<str:date>/<int:pk>",
        views.HouseReservationListCountView.as_view(),
        name="house_reservate_list",
    ),
    path(
        "evaluate-house/", views.HouseEvaluateListView.as_view(), name="evaluate_house",
    ),
    path(
        "evHouseReject/<int:pk>",
        views.HouseEvaluateRejectView.as_view(),
        name="evHouseReject",
    ),
    path(
        "evHouseAgree/<int:pk>",
        views.HouseEvaluateAgreeView.as_view(),
        name="evHouseAgree",
    ),
    path(
        "show-reject/<int:pk>", views.HouseRejectShowView.as_view(), name="show-reject",
    ),
    path(
        "delete-house/<int:pk>",
        views.HouseDeleteShowView.as_view(),
        name="show-reject",
    ),
    path(
        "update-house/<int:pk>",
        views.HouseUpdateShowView.as_view(),
        name="show-reject",
    ),
    path("book-list/", views.HouseBookListView.as_view(), name="book-list",),
    path(
        "score/<int:housePk>/<int:bookPk>",
        views.HouseScoreView.as_view(),
        name="get-score",
    ),
    path(
        "best-house/<int:houseType>", views.HouseBestView.as_view(), name="best-house",
    ),
]

