# Generated by Django 3.0.11 on 2021-03-06 02:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0004_auto_20210306_1057'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='chatting',
            options={'ordering': ['created_at']},
        ),
    ]
