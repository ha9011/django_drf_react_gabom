# Generated by Django 3.0.11 on 2021-03-02 04:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_auto_20210107_2300'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='avatar',
            field=models.ImageField(default='public/basic.JPG', upload_to='avatar/main/%Y/%m/%d'),
        ),
    ]