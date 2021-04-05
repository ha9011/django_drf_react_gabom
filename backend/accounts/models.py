from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.conf import settings


class User(AbstractUser):
    class GenderChoices(models.TextChoices):
        MALE = "M", "남성"  # DB에 저장되는 값 , 보여지는 값 주의
        FEMALE = "F", "여성"

    user_type = models.CharField(max_length=1)
    name = models.CharField(max_length=10)
    phone_number = models.CharField(
        max_length=13,
        validators=[RegexValidator(r"^010-?[1-9]\d{3}-?\d{4}$")],
        blank=True,
    )

    gender = models.CharField(max_length=1, choices=GenderChoices.choices)

    def __str__(self):
        return "__all__"


class Profile(models.Model):
    objects = models.Manager()
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    avatar = models.ImageField(
        default="public/basic.JPG", upload_to="avatar/main/%Y/%m/%d"
    )
    introduce = models.TextField()
