package com.ucsc.kpi_dashboard.Service;

import com.ucsc.kpi_dashboard.Payload.Dto.KpiDto;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiRequestDto;

import java.util.List;
import java.util.UUID;

public interface KPIService {

    KpiDto createKpi(KpiRequestDto requestDto);

    List<KpiDto> getAllKpis();

    KpiDto getKpiById(UUID id);

    KpiDto updateKpi(UUID id, KpiRequestDto requestDto);

    void deleteKpi(UUID id);
}