from django.db import models
from django.conf import settings

# Create your models here.
class ShoppingListItem(models.Model):

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    item = models.CharField(max_length=255)
    qty = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True, default=1)

    def __str__(self):
        return f'{self.qty} {self.item} for {self.user.email}'

