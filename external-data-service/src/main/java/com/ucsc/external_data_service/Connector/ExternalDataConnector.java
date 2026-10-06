package com.ucsc.external_data_service.Connector;

import com.ucsc.external_data_service.Dto.ExternalDataIndicatorResponse;

import java.time.LocalDate;
import java.util.List;

public interface ExternalDataConnector {

    String provider();

    List<ExternalDataIndicatorResponse> getData (
            String indicatorCode,
            LocalDate startDate,
            LocalDate endDate
    );
}
