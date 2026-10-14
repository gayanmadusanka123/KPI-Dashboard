package com.ucsc.kpi_dashboard.Controller;

import com.ucsc.kpi_dashboard.Payload.Dto.KpiPeriodDto;
import com.ucsc.kpi_dashboard.Service.KpiPeriodService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/kpi-periods")
public class KpiPeriodController {

    private final KpiPeriodService kpiPeriodService;

    public KpiPeriodController(KpiPeriodService kpiPeriodService) {
        this.kpiPeriodService = kpiPeriodService;
    }

    @PostMapping
    public ResponseEntity<KpiPeriodDto> createPeriod(
            @Valid @RequestBody KpiPeriodDto periodDto
    ) {
        return ResponseEntity
                .status(201)
                .body(kpiPeriodService.createPeriod(periodDto));
    }

    @GetMapping
    public ResponseEntity<List<KpiPeriodDto>> getAllPeriods() {
        return ResponseEntity.ok(kpiPeriodService.getAllPeriods());
    }

    @GetMapping("/{id}")
    public ResponseEntity<KpiPeriodDto> getPeriodById(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(kpiPeriodService.getPeriodById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<KpiPeriodDto> updatePeriod(
            @PathVariable UUID id,
            @Valid @RequestBody KpiPeriodDto periodDto
    ) {
        return ResponseEntity.ok(
                kpiPeriodService.updatePeriod(id, periodDto)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePeriod(@PathVariable UUID id) {
        kpiPeriodService.deletePeriod(id);
        return ResponseEntity.noContent().build();
    }
}