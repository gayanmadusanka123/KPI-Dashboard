package com.ucsc.kpi_dashboard.Payload.Dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record KpiForecastRequestDto(
        UUID kpiId,
        LocalDate forecastDate,
        BigDecimal forecastValue,
        BigDecimal lowerBound,
        BigDecimal upperBound,
        String modelName
) {
}
