package com.ucsc.kpi_dashboard.Controller;

import com.ucsc.kpi_dashboard.Payload.Dto.Performance.PerformanceResultBatchRequestDto;
import com.ucsc.kpi_dashboard.Payload.Dto.Performance.PerformanceResultsResponseDto;
import com.ucsc.kpi_dashboard.Service.KpiPeriodPerformanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

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

    @GetMapping("/results/{kpiId}")
    public ResponseEntity<PerformanceResultsResponseDto> getPerformanceResults(
            @PathVariable UUID kpiId){

        PerformanceResultsResponseDto response =
                kpiPeriodPerformanceService.getPerformanceResults(kpiId);

        return ResponseEntity.ok(response);
    }
}
