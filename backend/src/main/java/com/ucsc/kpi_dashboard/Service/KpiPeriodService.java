package com.ucsc.kpi_dashboard.Service;

import com.ucsc.kpi_dashboard.Payload.Dto.KpiPeriodDto;

import java.util.List;
import java.util.UUID;

public interface KpiPeriodService {

    KpiPeriodDto createPeriod(KpiPeriodDto periodDto);

    List<KpiPeriodDto> getAllPeriods();

    KpiPeriodDto getPeriodById(UUID id);

    KpiPeriodDto updatePeriod(UUID id, KpiPeriodDto periodDto);

    void deletePeriod(UUID id);
}