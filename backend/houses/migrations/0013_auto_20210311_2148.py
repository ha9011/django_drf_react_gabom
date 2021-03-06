# Generated by Django 3.0.11 on 2021-03-11 12:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('plans', '0022_detailplan_place_type'),
        ('houses', '0012_auto_20210311_1539'),
    ]

    operations = [
        migrations.AlterField(
            model_name='housedetaiiimage',
            name='houseRegist',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='housedetaiiImages', to='houses.Houseregist'),
        ),
        migrations.AlterField(
            model_name='housenoticeboard',
            name='house',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='house_notice_board', to='houses.Houseregist'),
        ),
        migrations.AlterField(
            model_name='housereservationboard',
            name='house',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='house_reservation', to='houses.Houseregist'),
        ),
        migrations.AlterUniqueTogether(
            name='housereservationboard',
            unique_together={('house', 'reservation_date', 'plan')},
        ),
    ]
