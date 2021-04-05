# Generated by Django 3.0.11 on 2021-01-14 11:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plans', '0004_auto_20210114_2038'),
    ]

    operations = [
        migrations.AlterField(
            model_name='plan',
            name='location',
            field=models.CharField(blank=True, max_length=30),
        ),
        migrations.AlterField(
            model_name='plan',
            name='recommend',
            field=models.IntegerField(blank=True, default=0),
        ),
        migrations.AlterField(
            model_name='plan',
            name='share',
            field=models.IntegerField(blank=True, default=0),
        ),
    ]
