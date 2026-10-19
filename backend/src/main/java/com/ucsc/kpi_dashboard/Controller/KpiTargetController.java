package com.ucsc.kpi_dashboard.Controller;

import com.ucsc.kpi_dashboard.Payload.Dto.KpiTargetDto;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiTargetRequestDto;
import com.ucsc.kpi_dashboard.Service.KpiTargetService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/kpi-targets")
public class KpiTargetController {

    private final KpiTargetService kpiTargetService;

    public KpiTargetController(KpiTargetService kpiTargetService) {
        this.kpiTargetService = kpiTargetService;
    }

    @PostMapping
    public ResponseEntity<KpiTargetDto> createTarget(
            @Valid @RequestBody KpiTargetRequestDto requestDto) {

        KpiTargetDto createdTarget =
                kpiTargetService.createTarget(requestDto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdTarget);
    }

    @GetMapping
    public ResponseEntity<List<KpiTargetDto>> getAllTargets() {

        return ResponseEntity.ok(
                kpiTargetService.getAllTargets()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<KpiTargetDto> getTargetById(
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                kpiTargetService.getTargetById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<KpiTargetDto> updateTarget(
            @PathVariable UUID id,
            @Valid @RequestBody KpiTargetRequestDto requestDto) {

        return ResponseEntity.ok(
                kpiTargetService.updateTarget(id, requestDto)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTarget(
            @PathVariable UUID id) {

        kpiTargetService.deleteTarget(id);

        return ResponseEntity.noContent().build();
    }
}