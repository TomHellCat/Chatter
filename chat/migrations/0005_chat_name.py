# Generated by Django 3.0.7 on 2021-06-01 13:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0004_chat_contact_message'),
    ]

    operations = [
        migrations.AddField(
            model_name='chat',
            name='name',
            field=models.CharField(blank=True, max_length=200),
        ),
    ]
