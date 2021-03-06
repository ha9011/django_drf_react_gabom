# Generated by Django 3.0.11 on 2021-03-17 13:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('plans', '0023_detailplan_house_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='PlanRejectReaSon',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField(blank=True, default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('plan', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='reject_reason', to='plans.Plan')),
            ],
        ),
    ]
