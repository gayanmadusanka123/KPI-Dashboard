package com.ucsc.kpi_dashboard.Service.Implimentation;

import com.ucsc.kpi_dashboard.Mapper.KpiTargetHistoryMapper;
import com.ucsc.kpi_dashboard.Model.KpiTargetHistory;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiTargetHistoryDto;
import com.ucsc.kpi_dashboard.Repository.KpiTargetHistoryRepository;
import com.ucsc.kpi_dashboard.Service.KpiTargetHistoryService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class KpiTargetHistoryServiceImpl
        implements KpiTargetHistoryService {

    private final KpiTargetHistoryRepository historyRepository;

    public KpiTargetHistoryServiceImpl(
            KpiTargetHistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    @Override
    public List<KpiTargetHistoryDto> getHistoryByTargetId(
            UUID targetId) {

        List<KpiTargetHistory> historyRecords =
                historyRepository.findByTarget_IdOrderByRecordedAtDesc(
                        targetId
                );

        return historyRecords.stream()
                .map(KpiTargetHistoryMapper::toDto)
                .toList();
    }
}