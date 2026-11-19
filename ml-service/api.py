from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from uuid import UUID

from tasks import calculate_kpi_performance_task

app = FastAPI(
    title="KPI ML Service",
    description="API for KPI forecasting and performance calculations",
    version="1.0.0"
)

class PerformanceCalculationRequest(BaseModel):
    kpi_id: UUID = Field(alias="kpiId")

@app.post("/api/performance/calculate", status_code=202)
def trigger_performance_calculation(
    request: PerformanceCalculationRequest
):
    try:
        task = calculate_kpi_performance_task.delay(
            str(request.kpi_id)
        )

        return {
            "message": "Performance calculation queued successfully",
            "taskId": task.id,
            "kpiId": str(request.kpi_id),
            "status": "QUEUED"
        }

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Could not queue performance calculation: {str(exc)}"
        )