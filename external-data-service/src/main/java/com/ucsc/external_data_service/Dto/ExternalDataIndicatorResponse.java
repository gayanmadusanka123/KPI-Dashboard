package com.ucsc.external_data_service.Dto;

import java.time.LocalDate;

public record ExternalDataIndicatorResponse(
        String provider,
        String indicatorCode,
        String indicatorName,
        LocalDate observationDate,
        Double value,
        String unit,
        String source
) {


}
