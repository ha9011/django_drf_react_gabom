# Generated by Django 3.0.11 on 2021-02-06 09:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plans', '0010_auto_20210206_1730'),
    ]

    operations = [
        migrations.AlterField(
            model_name='detailplan',
            name='move_turn',
            field=models.IntegerField(max_length=10),
        ),
    ]
