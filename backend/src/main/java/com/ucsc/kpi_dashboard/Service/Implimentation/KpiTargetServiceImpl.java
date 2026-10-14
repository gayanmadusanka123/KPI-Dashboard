package com.ucsc.kpi_dashboard.Service.Implimentation;

import com.ucsc.kpi_dashboard.Exeptions.ResourceNotFoundException;
import com.ucsc.kpi_dashboard.Mapper.KpiTargetMapper;
import com.ucsc.kpi_dashboard.Model.Kpi;
import com.ucsc.kpi_dashboard.Model.KpiPeriod;
import com.ucsc.kpi_dashboard.Model.KpiTarget;
import com.ucsc.kpi_dashboard.Model.KpiTargetHistory;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiTargetDto;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiTargetRequestDto;
import com.ucsc.kpi_dashboard.Repository.KpiRepository;
import com.ucsc.kpi_dashboard.Repository.KpiPeriodRepository;
import com.ucsc.kpi_dashboard.Repository.KpiTargetHistoryRepository;
import com.ucsc.kpi_dashboard.Repository.KpiTargetRepository;
import com.ucsc.kpi_dashboard.Service.KpiTargetService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class KpiTargetServiceImpl implements KpiTargetService {

    private final KpiTargetRepository kpiTargetRepository;
    private final KpiTargetHistoryRepository kpiTargetHistoryRepository;
    private final KpiRepository kpiRepository;
    private final KpiPeriodRepository kpiPeriodRepository;

    public KpiTargetServiceImpl(
            KpiTargetRepository kpiTargetRepository,
            KpiTargetHistoryRepository kpiTargetHistoryRepository,
            KpiRepository kpiRepository,
            KpiPeriodRepository kpiPeriodRepository) {

        this.kpiTargetRepository = kpiTargetRepository;
        this.kpiTargetHistoryRepository = kpiTargetHistoryRepository;
        this.kpiRepository = kpiRepository;
        this.kpiPeriodRepository = kpiPeriodRepository;
    }

    @Override
    public KpiTargetDto createTarget(
            KpiTargetRequestDto requestDto) {

        Kpi kpi = kpiRepository.findById(requestDto.getKpiId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("KPI not found"));

        KpiPeriod period = kpiPeriodRepository
                .findById(requestDto.getPeriodId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "KPI period not found"));

        KpiTarget target = new KpiTarget();
        target.setKpi(kpi);
        target.setPeriod(period);
        target.setTargetValue(requestDto.getTargetValue());
        target.setCreatedAt(LocalDateTime.now());

        // createdBy will be set when current-user
        // authentication is integrated.

        KpiTarget savedTarget = kpiTargetRepository.save(target);

        return KpiTargetMapper.toDto(savedTarget);
    }

    @Override
    @Transactional(readOnly = true)
    public List<KpiTargetDto> getAllTargets() {

        return kpiTargetRepository.findAll()
                .stream()
                .map(KpiTargetMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public KpiTargetDto getTargetById(UUID id) {

        KpiTarget target = kpiTargetRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "KPI target not found"));

        return KpiTargetMapper.toDto(target);
    }

    @Override
    public KpiTargetDto updateTarget(
            UUID id,
            KpiTargetRequestDto requestDto) {

        KpiTarget target = kpiTargetRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "KPI target not found"));

        // This implementation updates the target value.
        // KPI and period associations remain unchanged.

        if (target.getTargetValue()
                .compareTo(requestDto.getTargetValue()) != 0) {

            KpiTargetHistory history = new KpiTargetHistory();

            history.setTarget(target);
            history.setOldTargetValue(target.getTargetValue());
            history.setNewTargetValue(requestDto.getTargetValue());
            history.setEditReason(requestDto.getEditReason());
            history.setRecordedAt(LocalDateTime.now());

            // recordedBy will be set when current-user
            // authentication is integrated.

            kpiTargetHistoryRepository.save(history);

            target.setTargetValue(requestDto.getTargetValue());
            target.setUpdatedAt(LocalDateTime.now());

            // updatedBy will be set when current-user
            // authentication is integrated.
        }

        KpiTarget updatedTarget = kpiTargetRepository.save(target);

        return KpiTargetMapper.toDto(updatedTarget);
    }

    @Override
    public void deleteTarget(UUID id) {

        KpiTarget target = kpiTargetRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "KPI target not found"));

        kpiTargetRepository.delete(target);
    }
}