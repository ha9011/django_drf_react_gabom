# Generated by Django 3.0.11 on 2021-03-11 01:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('houses', '0007_auto_20210309_1027'),
    ]

    operations = [
        migrations.AlterField(
            model_name='housedetaiiimage',
            name='houseRegist',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='housedetaiiImages', to='houses.Houseregist'),
        ),
        migrations.CreateModel(
            name='HouseNoticeBoard',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('house', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='house_notice_board', to='houses.Houseregist')),
            ],
        ),
    ]