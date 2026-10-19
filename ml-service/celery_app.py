import os
from celery import Celery

celery_app = Celery(
    "kpi_ml",
    broker=os.getenv(
        "CELERY_BROKER_URL",
        "redis://localhost:16379/0"
    ),
    backend=os.getenv(
        "CELERY_RESULT_BACKEND",
        "redis://localhost:16379/1"
    ),
    include=["tasks"]
)