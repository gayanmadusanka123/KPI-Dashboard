package com.ucsc.kpi_dashboard.Controller;

import com.ucsc.kpi_dashboard.Payload.Dto.Performance.PerformanceInputDto;
import com.ucsc.kpi_dashboard.Service.PerformanceInputService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/performance")
@RequiredArgsConstructor
public class PerformanceInputController {

    private final PerformanceInputService performanceInputService;

    @GetMapping("/inputs/{kpiId}")
    public ResponseEntity<PerformanceInputDto> getPerformanceInputById(
            @PathVariable UUID kpiId){

        return ResponseEntity.ok(
                performanceInputService.getPerformanceInputs(kpiId));
    }
}
