# Generated by Django 5.1.5 on 2025-03-22 19:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shopping_list_app', '0002_alter_shoppinglistitem_qty'),
    ]

    operations = [
        migrations.AddField(
            model_name='shoppinglistitem',
            name='measure',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
