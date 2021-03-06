# Generated by Django 3.0.11 on 2021-03-12 07:23

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('houses', '0015_auto_20210312_1555'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='houseqnarepleboard',
            name='house',
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
            model_name='houseqnaboard',
            name='house',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='house_qna_board', to='houses.Houseregist'),
        ),
        migrations.AlterField(
            model_name='housereservationboard',
            name='house',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='house_reservation', to='houses.Houseregist'),
        ),
    ]
