package com.ucsc.kpi_dashboard.Service;

import com.ucsc.kpi_dashboard.Payload.Dto.KpiActualHistoryDto;

import java.util.List;
import java.util.UUID;

public interface KpiActualHistoryService {

    List<KpiActualHistoryDto> getHistoryByActualId(UUID actualId);
}