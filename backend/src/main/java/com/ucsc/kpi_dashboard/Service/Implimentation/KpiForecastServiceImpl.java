package com.ucsc.kpi_dashboard.Service.Implimentation;

import com.ucsc.kpi_dashboard.Model.Kpi;
import com.ucsc.kpi_dashboard.Model.KpiForecast;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiForecastRequestDto;
import com.ucsc.kpi_dashboard.Repository.KpiForecastRepository;
import com.ucsc.kpi_dashboard.Repository.KpiRepository;
import com.ucsc.kpi_dashboard.Service.KpiForecastService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class KpiForecastServiceImpl implements KpiForecastService {

    private final KpiForecastRepository kpiForecastRepository;
    private final KpiRepository kpiRepository;

    @Override
    @Transactional
    public List<KpiForecast> saveForecasts(List<KpiForecastRequestDto> requestDtos){
        if (requestDtos == null || requestDtos.isEmpty()){
            throw new IllegalArgumentException(
                    "Forecast list cannot be null or empty"
            );
        }

        List<KpiForecast> forecasts = requestDtos.stream()
                .map(request -> {
                    Kpi kpi = kpiRepository.findById(request.kpiId())
                            .orElseThrow(() -> new EntityNotFoundException(
                                    "KPI not found: " + request.kpiId()
                            ));

                    KpiForecast forecast = new KpiForecast();
                    forecast.setId(UUID.randomUUID());
                    forecast.setKpi(kpi);
                    forecast.setForecastDate(request.forecastDate());
                    forecast.setForecastValue(request.forecastValue());
                    forecast.setLowerBound(request.lowerBound());
                    forecast.setUpperBound(request.upperBound());
                    forecast.setModelName(request.modelName());

                    return forecast;
                }).toList();

        return kpiForecastRepository.saveAll(forecasts);
    }
}
