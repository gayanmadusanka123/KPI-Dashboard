package com.ucsc.kpi_dashboard.Events;

import com.ucsc.kpi_dashboard.Service.PerformanceCalculationClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class KpiActualChangedEventListener {

    private final PerformanceCalculationClient calculationClient;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleKpiActualChangedEvent(KpiActualChangedEvent event) {
        calculationClient.triggerCalculation(event.kpiId());
    }
}
