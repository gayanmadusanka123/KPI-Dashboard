package com.ucsc.kpi_dashboard.Service;

import com.ucsc.kpi_dashboard.Exeptions.KPIException;
import com.ucsc.kpi_dashboard.Payload.Dto.KPIDto;

import java.util.List;

public interface KPIService {

    KPIDto createKPI(KPIDto dto) throws KPIException;

    KPIDto updateKPI(Long id, KPIDto dto) throws KPIException;

    KPIDto getKPIById(Long id) throws KPIException;

    List<KPIDto> getAllKPIs() throws KPIException;

    void deleteKPI(Long id) throws KPIException;
}