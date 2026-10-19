package com.ucsc.kpi_dashboard.Controller;

import com.ucsc.kpi_dashboard.Payload.Dto.KpiTargetHistoryDto;
import com.ucsc.kpi_dashboard.Service.KpiTargetHistoryService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/kpi-targets")
public class KpiTargetHistoryController {

    private final KpiTargetHistoryService historyService;

    public KpiTargetHistoryController(
            KpiTargetHistoryService historyService) {
        this.historyService = historyService;
    }

    @GetMapping("/{targetId}/history")
    public ResponseEntity<List<KpiTargetHistoryDto>> getTargetHistory(
            @PathVariable UUID targetId) {

        return ResponseEntity.ok(
                historyService.getHistoryByTargetId(targetId)
        );
    }
}