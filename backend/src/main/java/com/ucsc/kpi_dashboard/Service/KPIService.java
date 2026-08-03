package com.ucsc.kpi_dashboard.Service;

import com.ucsc.kpi_dashboard.Domain.KpiTypes;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiProfileDto;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiValueDto;

import java.time.LocalDate;
import java.util.List;

public interface KPIService {

    List<KpiProfileDto> getAllKpiProfiles();
    KpiProfileDto getKpiProfileByType(KpiTypes kpiTypes);
    KpiValueDto saveKpiValue(KpiTypes kpiTypes, double actualValue, LocalDate date);
    List<KpiValueDto> getValueByProfile(KpiTypes kpiTypes);
}
