package com.ucsc.kpi_dashboard.Controller;

import com.ucsc.kpi_dashboard.Payload.Dto.Performance.PerformanceResultBatchRequestDto;
import com.ucsc.kpi_dashboard.Service.KpiPeriodPerformanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/performance")
@RequiredArgsConstructor
public class KpiPeriodPerformanceController {

    private final KpiPeriodPerformanceService kpiPeriodPerformanceService;

    @PostMapping("/results/batch")
    public ResponseEntity<String> savePerformanceResults(
            @Valid @RequestBody PerformanceResultBatchRequestDto request){

        kpiPeriodPerformanceService.savePerformanceResults(request);

        return ResponseEntity.ok(
                "Performance results saved successfully"
        );
    }
}
