# Generated by Django 3.0.11 on 2021-03-23 22:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('plans', '0028_detailplan_reservation_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='shareplan',
            old_name='recommend',
            new_name='share_id',
        ),
    ]
