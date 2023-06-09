from celery_auction import app


@app.task
def set_lot_as_unavailable(lot):
    lot.is_available = False
    lot.save()
