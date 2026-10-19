package com.ucsc.kpi_dashboard.Service.Implimentation;

import com.ucsc.kpi_dashboard.Mapper.KpiActualHistoryMapper;
import com.ucsc.kpi_dashboard.Model.KpiActualHistory;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiActualHistoryDto;
import com.ucsc.kpi_dashboard.Repository.KpiActualHistoryRepository;
import com.ucsc.kpi_dashboard.Service.KpiActualHistoryService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class KpiActualHistoryServiceImpl
        implements KpiActualHistoryService {

    private final KpiActualHistoryRepository historyRepository;

    public KpiActualHistoryServiceImpl(
            KpiActualHistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    @Override
    public List<KpiActualHistoryDto> getHistoryByActualId(
            UUID actualId) {

        List<KpiActualHistory> historyRecords =
                historyRepository.findByActual_IdOrderByRecordedAtDesc(
                        actualId
                );

        return historyRecords.stream()
                .map(KpiActualHistoryMapper::toDto)
                .toList();
    }
}