package com.ucsc.kpi_dashboard.Controller;

import com.ucsc.kpi_dashboard.Payload.Dto.KpiActualDto;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiActualObservationDto;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiActualRequestDto;
import com.ucsc.kpi_dashboard.Service.KpiActualService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/kpi-actuals")
public class KpiActualController {

    private final KpiActualService kpiActualService;

    public KpiActualController(
            KpiActualService kpiActualService) {
        this.kpiActualService = kpiActualService;
    }

    @PostMapping
    public ResponseEntity<KpiActualDto> createActual(
            @Valid @RequestBody KpiActualRequestDto requestDto) {

        KpiActualDto createdActual =
                kpiActualService.createActual(requestDto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdActual);
    }

    @GetMapping
    public ResponseEntity<List<KpiActualDto>> getAllActuals() {

        return ResponseEntity.ok(
                kpiActualService.getAllActuals()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<KpiActualDto> getActualById(
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                kpiActualService.getActualById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<KpiActualDto> updateActual(
            @PathVariable UUID id,
            @Valid @RequestBody KpiActualRequestDto requestDto) {

        return ResponseEntity.ok(
                kpiActualService.updateActual(id, requestDto)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActual(
            @PathVariable UUID id) {

        kpiActualService.deleteActual(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/observations/{kpiId}")
    public ResponseEntity<List<KpiActualObservationDto>> getActualHistory(
            @PathVariable UUID kpiId){

        return ResponseEntity.ok(
                kpiActualService.getActualHistory(kpiId)
        );
    }
}