package com.ucsc.kpi_dashboard.Controller;

import com.ucsc.kpi_dashboard.Payload.Dto.KpiForecastRequestDto;
import com.ucsc.kpi_dashboard.Service.KpiForecastService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/forecasts")
@RequiredArgsConstructor
public class KpiForecastController {

    private final KpiForecastService kpiForecastService;

    @PostMapping("/batch")
    public ResponseEntity<Void> saveForecasts(
            @RequestBody List<KpiForecastRequestDto> requestDtos){

        kpiForecastService.saveForecasts(requestDtos);

        return ResponseEntity.noContent().build();
    }
}
