# Generated by Django 3.0.11 on 2021-03-02 09:56

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('plans', '0018_auto_20210302_1850'),
    ]

    operations = [
        migrations.AlterField(
            model_name='plan',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='createUser', to=settings.AUTH_USER_MODEL),
        ),
    ]
