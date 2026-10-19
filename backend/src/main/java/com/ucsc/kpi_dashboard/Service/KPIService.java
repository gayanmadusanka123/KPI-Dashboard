package com.ucsc.kpi_dashboard.Service;

import com.ucsc.kpi_dashboard.Domain.KpiTypes;
import com.ucsc.kpi_dashboard.Exeptions.UserException;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiProfileDto;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiValueDto;

import java.time.LocalDate;
import java.util.List;

public interface KPIService {

    List<KpiProfileDto> getAllKpiProfiles();
    KpiProfileDto getKpiProfileByType(KpiTypes kpiTypes) throws UserException;
    KpiValueDto saveKpiValue(KpiTypes kpiTypes, double actualValue, LocalDate date) throws UserException;
    List<KpiValueDto> getValueByType(KpiTypes kpiTypes) throws UserException;
}