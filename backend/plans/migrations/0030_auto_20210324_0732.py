# Generated by Django 3.0.11 on 2021-03-23 22:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('plans', '0029_auto_20210324_0729'),
    ]

    operations = [
        migrations.RenameField(
            model_name='plan',
            old_name='recommend',
            new_name='share_id',
        ),
        migrations.RenameField(
            model_name='shareplan',
            old_name='share_id',
            new_name='recommend',
        ),
    ]
