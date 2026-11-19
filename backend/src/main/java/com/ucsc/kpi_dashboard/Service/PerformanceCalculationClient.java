package com.ucsc.kpi_dashboard.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;
import java.util.UUID;

@Component
public class PerformanceCalculationClient {

    private final RestClient restClient;

    public PerformanceCalculationClient(
            RestClient.Builder builder,
            @Value("${ml.service.base-url}") String mlServiceUrl
    ){
        this.restClient = builder.baseUrl(mlServiceUrl).build();
    }

    public void triggerCalculation(UUID kpiId){
        restClient.post()
                .uri("/api/performance/calculate")
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("kpiId", kpiId.toString()))
                .retrieve()
                .toBodilessEntity();
    }
}
