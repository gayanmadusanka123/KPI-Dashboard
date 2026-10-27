package com.ucsc.kpi_dashboard.Service;

import com.ucsc.kpi_dashboard.Payload.Dto.KpiActualDto;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiActualRequestDto;

import java.util.List;
import java.util.UUID;

public interface KpiActualService {

    KpiActualDto createActual(KpiActualRequestDto requestDto);

    List<KpiActualDto> getAllActuals();

    KpiActualDto getActualById(UUID id);

    KpiActualDto updateActual(
            UUID id,
            KpiActualRequestDto requestDto
    );

    void deleteActual(UUID id);
}