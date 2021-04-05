# Generated by Django 3.0.11 on 2021-01-07 14:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_auto_20210107_2100'),
    ]

    operations = [
        migrations.RenameField(
            model_name='profile',
            old_name='username',
            new_name='user',
        ),
        migrations.AlterField(
            model_name='profile',
            name='avatar',
            field=models.ImageField(default='/media/public/basic.JPG', upload_to='avatar/main/%Y/%m/%d'),
        ),
    ]
