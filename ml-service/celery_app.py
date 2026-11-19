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

"""
celery -A celery_app:celery_app worker --loglevel=INFO --pool=solo

python -c "from tasks import test_kpi_forecasting; result = test_kpi_forecasting.delay(); print('Task ID:', result.id); print('Result:', result.get(timeout=180))"
"""