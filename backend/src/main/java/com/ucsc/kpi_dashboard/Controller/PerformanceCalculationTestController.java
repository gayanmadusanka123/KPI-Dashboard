package com.ucsc.kpi_dashboard.Controller;

import com.ucsc.kpi_dashboard.Service.PerformanceCalculationClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/performance")
@RequiredArgsConstructor
public class PerformanceCalculationTestController {

    private final PerformanceCalculationClient calculationClient;

    @PostMapping("/trigger-test/{kpiId}")
    public ResponseEntity<String> triggerTest(@PathVariable UUID kpiId) {
        calculationClient.triggerCalculation(kpiId);

        return ResponseEntity.accepted().body(
                "Performance calculation triggered successfully for KPI : "
                + kpiId
        );
    }
}
