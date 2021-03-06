from . import consumers
from django.conf.urls import url

websocket_urlpatterns = [
    url(r"^ws/chat/(?P<room_name>[^/]+)/$", consumers.ChatConsumer),
    url(r"^ws/chat/main/(?P<userName>[^/]+)/$", consumers.MainConsumer),
]
