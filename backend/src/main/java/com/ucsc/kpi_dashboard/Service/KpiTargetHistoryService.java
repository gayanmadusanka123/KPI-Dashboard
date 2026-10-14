package com.ucsc.kpi_dashboard.Service;

import com.ucsc.kpi_dashboard.Payload.Dto.KpiTargetHistoryDto;

import java.util.List;
import java.util.UUID;

public interface KpiTargetHistoryService {

    List<KpiTargetHistoryDto> getHistoryByTargetId(UUID targetId);
}