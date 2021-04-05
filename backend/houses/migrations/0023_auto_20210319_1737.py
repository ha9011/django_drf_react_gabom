# Generated by Django 3.0.11 on 2021-03-19 08:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('houses', '0022_auto_20210319_1632'),
    ]

    operations = [
        migrations.AlterField(
            model_name='housedetaiiimage',
            name='houseRegist',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='housedetaiiImages', to='houses.Houseregist'),
        ),
        migrations.AlterField(
            model_name='houselike',
            name='house',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='house_like', to='houses.Houseregist'),
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
            model_name='houserejectreason',
            name='houseregist',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='house_reject_reason', to='houses.Houseregist'),
        ),
        migrations.AlterField(
            model_name='housereservationboard',
            name='house',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='house_reservation', to='houses.Houseregist'),
        ),
        migrations.AlterField(
            model_name='housescore',
            name='house',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='house_score', to='houses.Houseregist'),
        ),
    ]
