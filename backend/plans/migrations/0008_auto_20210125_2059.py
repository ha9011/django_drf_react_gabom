# Generated by Django 3.0.11 on 2021-01-25 11:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('plans', '0007_detailplan'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='detailplan',
            options={'ordering': ['move_turn']},
        ),
        migrations.AlterModelOptions(
            name='plandate',
            options={'ordering': ['nth_day']},
        ),
    ]
