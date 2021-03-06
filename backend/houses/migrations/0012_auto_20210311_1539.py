# Generated by Django 3.0.11 on 2021-03-11 06:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('plans', '0021_auto_20210303_2116'),
        ('houses', '0011_auto_20210311_1534'),
    ]

    operations = [
        migrations.AddField(
            model_name='housereservationboard',
            name='plan',
            field=models.ForeignKey(default=31, on_delete=django.db.models.deletion.CASCADE, related_name='house_reservation_plan', to='plans.Plan'),
            preserve_default=False,
        ),
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
    ]
