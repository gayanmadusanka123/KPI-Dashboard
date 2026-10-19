package com.ucsc.kpi_dashboard.Controller;

import com.ucsc.kpi_dashboard.Payload.Dto.KpiDto;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiRequestDto;
import com.ucsc.kpi_dashboard.Service.KPIManagementService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/kpis")
@RequiredArgsConstructor
public class KpiManagementController {

    private final KPIManagementService kpiService;

    // Create a KPI
    @PostMapping
    public ResponseEntity<KpiDto> createKpi(
            @Valid @RequestBody KpiRequestDto requestDto
    ) {
        return ResponseEntity
                .status(201)
                .body(kpiService.createKpi(requestDto));
    }

    // Get all KPIs
    @GetMapping
    public ResponseEntity<List<KpiDto>> getAllKpis() {
        return ResponseEntity.ok(kpiService.getAllKpis());
    }

    // Get a KPI by ID
    @GetMapping("/{id}")
    public ResponseEntity<KpiDto> getKpiById(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(kpiService.getKpiById(id));
    }

    // Update a KPI
    @PutMapping("/{id}")
    public ResponseEntity<KpiDto> updateKpi(
            @PathVariable UUID id,
            @Valid @RequestBody KpiRequestDto requestDto
    ) {
        return ResponseEntity.ok(
                kpiService.updateKpi(id, requestDto)
        );
    }

    // Delete a KPI
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteKpi(
            @PathVariable UUID id
    ) {
        kpiService.deleteKpi(id);
        return ResponseEntity.noContent().build();
    }
}