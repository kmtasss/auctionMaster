from django.db import models
from django.contrib.auth.models import User
from .tasks import set_lot_as_unavailable
from auctionProject.yandex_s3_storage import ClientDocsStorage


class Lot(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=255, blank=True)
    image = models.FileField(storage=ClientDocsStorage(), null=True, blank=True)
    first_price = models.IntegerField()
    current_price = models.IntegerField()
    creation_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField()
    is_available = models.BooleanField(default=True)
    creator = models.ForeignKey(User, verbose_name='Создатель', related_name='Creator', on_delete=models.CASCADE)
    current_buyer = models.ForeignKey(User, verbose_name='Покупатель', related_name='Buyer', on_delete=models.CASCADE, blank=True, null=True)

    def save(self, *args, **kwargs):
        create_task = False
        if self.pk is None:
            create_task = True

        super(Lot, self).save(*args, **kwargs)

        if create_task:
            set_lot_as_unavailable.apply_async(args=[self.pk], eta=self.end_time)

    def __str__(self):
        return self.name
