from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from rest_framework.response import Response

import json


class ChatConsumer(WebsocketConsumer):
    # websocket 연결 시 실행
    def connect(self):
        print("접속")
        # print(self.scope)
        # chat/routing.py 에 있는
        # url(r'^ws/chat/(?P<room_name>[^/]+)/$', consumers.ChatConsumer),
        # 에서 room_name 을 가져옵니다.
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_%s" % self.room_name
        print(self.room_name)
        print(self.room_group_name)
        # 그룹에 join
        # send 등 과 같은 동기적인 함수를 비동기적으로 사용하기 위해서는 async_to_sync 로 감싸줘야한다.
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )
        print(".........")
        # WebSocket 연결
        self.accept()

    # websocket 연결 종료 시 실행
    def disconnect(self, close_code):
        print("팅김")
        # 그룹에서 Leave
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    # 클라이언트로부터 메세지를 받을 시 실행
    def receive(self, text_data):
        print("받기")
        text_data_json = json.loads(text_data)
        print(text_data_json)
        message = text_data_json

        # room group 에게 메세지 send
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {"type": "chat_message", "message": text_data_json}
        )

    # room group 에서 메세지 receive
    def chat_message(self, event):
        print("보내기")
        print(event)
        message = event["message"]

        # WebSocket 에게 메세지 전송
        self.send(text_data=json.dumps({"message": message}))


class MainConsumer(WebsocketConsumer):
    # websocket 연결 시 실행
    def connect(self):
        print("메인-접속")
        # print(self.scope)
        # chat/routing.py 에 있는
        # url(r'^ws/chat/(?P<room_name>[^/]+)/$', consumers.ChatConsumer),
        # 에서 room_name 을 가져옵니다.
        self.user_name = self.scope["url_route"]["kwargs"]["userName"]
        self.user_group_name = "main_%s" % self.user_name  # main_하동투
        print(self.user_name)
        print(self.user_group_name)
        # 그룹에 join
        # send 등 과 같은 동기적인 함수를 비동기적으로 사용하기 위해서는 async_to_sync 로 감싸줘야한다.
        async_to_sync(self.channel_layer.group_add)(
            self.user_group_name, self.channel_name
        )
        print(".........")
        # WebSocket 연결
        self.accept()

    # websocket 연결 종료 시 실행
    def disconnect(self, close_code):
        print("메인-팅김")
        # 그룹에서 Leave
        async_to_sync(self.channel_layer.group_discard)(
            self.user_group_name, self.channel_name
        )

    # 클라이언트로부터 메세지를 받을 시 실행
    def receive(self, text_data):
        print("메인-받기")
        text_data_json = json.loads(text_data)
        print(text_data_json)
        message = text_data_json["message"]
        move_msg = text_data_json["move_msg"]

        planId = text_data_json["planId"]

        userPk = text_data_json["userPk"]

        sender = "main_%s" % userPk
        # room group 에게 메세지 send
        async_to_sync(self.channel_layer.group_send)(
            sender, {"type": "main_message", "message": text_data_json}
        )

    # room group 에서 메세지 receive
    def main_message(self, event):
        print("메인-보내기")
        print(event)
        message = event["message"]

        # WebSocket 에게 메세지 전송
        self.send(text_data=json.dumps({"message": message}))


# 받기
# {'message': '미안', 'userImg': 'http://localhost:8000/media/public/basic.JPG', 'userName': '하동투', 'planNo': '31'}
# 보내기
# {'type': 'chat_message', 'message': {'message': '미안', 'userImg': 'http://localhost:8000/media/public/basic.JPG',
# 'userName': '하동투', 'planNo': '31'}}
