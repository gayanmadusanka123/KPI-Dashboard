package com.ucsc.kpi_dashboard.Controller;

import com.ucsc.kpi_dashboard.Payload.Dto.KpiActualHistoryDto;
import com.ucsc.kpi_dashboard.Service.KpiActualHistoryService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/kpi-actuals")
public class KpiActualHistoryController {

    private final KpiActualHistoryService historyService;

    public KpiActualHistoryController(
            KpiActualHistoryService historyService) {
        this.historyService = historyService;
    }

    @GetMapping("/{actualId}/history")
    public ResponseEntity<List<KpiActualHistoryDto>> getActualHistory(
            @PathVariable UUID actualId) {

        return ResponseEntity.ok(
                historyService.getHistoryByActualId(actualId)
        );
    }
}