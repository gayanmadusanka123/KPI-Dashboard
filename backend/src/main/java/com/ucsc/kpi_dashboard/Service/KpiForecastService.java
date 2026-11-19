package com.ucsc.kpi_dashboard.Service;

import com.ucsc.kpi_dashboard.Model.KpiForecast;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiForecastRequestDto;

import java.util.List;

public interface KpiForecastService {
    List<KpiForecast> saveForecasts(List<KpiForecastRequestDto> requestDtos);
}
