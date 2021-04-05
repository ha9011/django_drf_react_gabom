from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("accounts.urls")),
    path("houses/", include("houses.urls")),
    path("plans/", include("plans.urls")),
    path("chat/", include("chat.urls")),
    path("gabomAdmin/", include("gabomAdmin.urls")),
    path("friend/", include("friend.urls")),
    path("api-auth/", include("rest_framework.urls")),
]


if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL, document_root=settings.MEDIA_ROOT
    )  # 인자(1)로 값이 오면 인자(2)로 셋팅하겠다

    import debug_toolbar

    urlpatterns += [
        path("__debug__/", include(debug_toolbar.urls)),
    ]
