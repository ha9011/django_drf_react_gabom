# Generated by Django 3.0.11 on 2021-03-23 23:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('plans', '0031_sharescore'),
    ]

    operations = [
        migrations.AddField(
            model_name='sharescore',
            name='plan',
            field=models.OneToOneField(default='', on_delete=django.db.models.deletion.CASCADE, related_name='share_score_plan', to='plans.Plan'),
            preserve_default=False,
        ),
    ]