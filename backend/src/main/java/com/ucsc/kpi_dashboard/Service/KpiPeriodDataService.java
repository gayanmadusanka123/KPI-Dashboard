package com.ucsc.kpi_dashboard.Service;

import com.ucsc.kpi_dashboard.Exeptions.KpiPeriodDataException;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiPeriodDataDto;

import java.util.List;

public interface KpiPeriodDataService {

    KpiPeriodDataDto addPeriodData(KpiPeriodDataDto dto) throws KpiPeriodDataException;

    KpiPeriodDataDto updatePeriodData(Long id, KpiPeriodDataDto dto) throws KpiPeriodDataException;

    KpiPeriodDataDto getPeriodDataById(Long id) throws KpiPeriodDataException;

    List<KpiPeriodDataDto> getPeriodDataByKpi(Long kpiId) throws KpiPeriodDataException;

    void deletePeriodData(Long id) throws KpiPeriodDataException;
}