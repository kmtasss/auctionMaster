from celery import shared_task


@shared_task
def set_lot_as_unavailable(lot_id):
    from .models import Lot

    lot = Lot.objects.get(pk=lot_id)
    if lot:
        lot.is_available = False
        lot.save()
