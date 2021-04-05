DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",  #   [1]
        "NAME": "gabom",  #   [2]
        "USER": "root",  #   [3]
        "PASSWORD": "1111",  #   [4]
        "HOST": "localhost",  #   [5]
        "PORT": "3306",  #   [6]
    }
}


# [ 1 ] : 사용할 엔진 설정. 그대로 두면 됨
# [ 2 ] : 연동할 MySQL의 데이터베이스 이름
# [ 3 ] : DB 접속 계정명
# [ 4 ] : 해당 DB 접속 계정 비밀번호
# [ 5 ] : 실제 DB 주소, 따로 설정 안했으면 그대로 두면 됨
# [ 6 ] : 포트번호, 따로 설정 안했으면 그대로 두면 됨


smtp_info = dict(
    {
        "smtp_server": "smtp.naver.com",  # SMTP 서버 주소
        "smtp_user_id": "ha90111@naver.com",
        "smtp_user_pw": "dltmdrl13@",
        "smtp_port": 587,
    }
)  # SMTP 서버 포트


DJ_SECRET_KEY = "s3na22td8@makrrs4c85b2@&#9ir!#ie7jxekywry#1bzm&nfj"
