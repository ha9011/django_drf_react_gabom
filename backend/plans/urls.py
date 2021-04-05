from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from . import views


urlpatterns = [
    # path("signupz/", views.SignupView.as_view(), name="signup"),
    path("makeplan/", views.MakePlanView.as_view(), name="houseinfo"),
    path("will-apply-plan/", views.WillApplyPlanView.as_view(), name="willapplyPlan"),
    path(
        "cancel-apply-plan/",
        views.CancelApplyPlanView.as_view(),
        name="cancelapplyPlan",
    ),
    path("evaluate-plan/", views.EvaluatePlanView.as_view(), name="evaluatePlan"),
    path("apply-plan/", views.ApplyPlanView.as_view(), name="applyPlan"),
    path(
        "show-reject/<int:planId>",
        views.ApplyPlanRejectView.as_view(),
        name="show_reject",
    ),
    path(
        "evPlanReject/<int:planId>",
        views.ApplyPlanRejectView.as_view(),
        name="evPlanReject",
    ),
    path(
        "evPlanAgree/<int:planId>",
        views.ApplyPlanAgreeView.as_view(),
        name="evPlanAgree",
    ),
    # 맴버 리스트
    path(
        "planMember/<int:planId>", views.ShowMemberListView.as_view(), name="planMember"
    ),
    # 맴버 강퇴
    path(
        "kickOuts/<int:planNo>/<int:memberId>",
        views.KickOutsView.as_view(),
        name="kickOuts",
    ),
    # 여행 승인
    path("agreeplan/<int:planId>", views.AgreePlanView.as_view(), name="agreePlan"),
    # 여행 거절
    path(
        "rejectplan/<int:planId>", views.RejectPlanListView.as_view(), name="rejectPlan"
    ),
    # 여행 탈퇴
    path(
        "withdraw/<int:planId>", views.WithdrawListView.as_view(), name="withdrawPlan"
    ),
    # 맴버 초대
    path("invite/", views.InviteView.as_view(), name="invite",),
    # 여행 세부 저장
    path("detailsave/<int:planId>", views.DetailDateView.as_view(), name="detailsave",),
    # path("plans/<int:pk>", views.HouseByIdView.as_view(), name="housebyid"),
    path(
        "detailplan/<int:travelNo>", views.DetailPlanView.as_view(), name="detailplan"
    ),
    path("areacode/<int:areacode>", views.AreaPlanView.as_view(), name="areacode"),
    path(
        "sigungu/<int:areacode>/<int:sigungu>/<int:page>",
        views.SiGunGuPlanView.as_view(),
        name="sigungu",
    ),
    path("placeId/<int:placeId>", views.PlaceIdView.as_view(), name="placeId"),
    path(
        "change-date/<int:planId>",
        views.PlanDateChangeView.as_view(),
        name="plandatechange",
    ),
    path(
        "share-plan/<str:location>",
        views.SharePlanSearchView.as_view(),
        name="plandatechange",
    ),
    path(
        "share-detail/<int:shareId>",
        views.ShareDetailPlanSearchView.as_view(),
        name="plandatechange",
    ),
    path(
        "share-score/<int:shareId>/<int:planId>",
        views.ShareScoreView.as_view(),
        name="plandatechange",
    ),
    path(
        "check-exist/<int:planId>",
        views.PlanCheckExistView.as_view(),
        name="plan_check",
    ),
    path(
        "best-share/<int:shareType>",
        views.ShareBestPlanView.as_view(),
        name="plan_check",
    ),
]
