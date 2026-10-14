package com.ucsc.kpi_dashboard.Service;

import com.ucsc.kpi_dashboard.Payload.Dto.KpiTargetDto;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiTargetRequestDto;

import java.util.List;
import java.util.UUID;

public interface KpiTargetService {

    KpiTargetDto createTarget(KpiTargetRequestDto requestDto);

    List<KpiTargetDto> getAllTargets();

    KpiTargetDto getTargetById(UUID id);

    KpiTargetDto updateTarget(
            UUID id,
            KpiTargetRequestDto requestDto
    );

    void deleteTarget(UUID id);
}