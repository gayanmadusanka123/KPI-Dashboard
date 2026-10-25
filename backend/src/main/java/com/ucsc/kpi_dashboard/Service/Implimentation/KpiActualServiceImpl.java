package com.ucsc.kpi_dashboard.Service.Implimentation;

import com.ucsc.kpi_dashboard.Exeptions.ResourceNotFoundException;
import com.ucsc.kpi_dashboard.Mapper.KpiActualMapper;
import com.ucsc.kpi_dashboard.Model.Kpi;
import com.ucsc.kpi_dashboard.Model.KpiActual;
import com.ucsc.kpi_dashboard.Model.KpiActualHistory;
import com.ucsc.kpi_dashboard.Model.KpiPeriod;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiActualDto;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiActualHistoryDto;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiActualObservationDto;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiActualRequestDto;
import com.ucsc.kpi_dashboard.Repository.KpiActualHistoryRepository;
import com.ucsc.kpi_dashboard.Repository.KpiActualRepository;
import com.ucsc.kpi_dashboard.Repository.KpiPeriodRepository;
import com.ucsc.kpi_dashboard.Repository.KpiRepository;
import com.ucsc.kpi_dashboard.Service.KpiActualService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class KpiActualServiceImpl implements KpiActualService {

    private final KpiActualRepository kpiActualRepository;
    private final KpiActualHistoryRepository kpiActualHistoryRepository;
    private final KpiRepository kpiRepository;
    private final KpiPeriodRepository kpiPeriodRepository;

    public KpiActualServiceImpl(
            KpiActualRepository kpiActualRepository,
            KpiActualHistoryRepository kpiActualHistoryRepository,
            KpiRepository kpiRepository,
            KpiPeriodRepository kpiPeriodRepository) {

        this.kpiActualRepository = kpiActualRepository;
        this.kpiActualHistoryRepository = kpiActualHistoryRepository;
        this.kpiRepository = kpiRepository;
        this.kpiPeriodRepository = kpiPeriodRepository;
    }

    @Override
    public KpiActualDto createActual(
            KpiActualRequestDto requestDto) {

        Kpi kpi = kpiRepository.findById(requestDto.getKpiId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("KPI not found"));

        KpiPeriod period = kpiPeriodRepository
                .findById(requestDto.getPeriodId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "KPI period not found"));

        KpiActual actual = new KpiActual();
        actual.setKpi(kpi);
        actual.setPeriod(period);
        actual.setActualValue(requestDto.getActualValue());
        actual.setDataConfidence(requestDto.getDataConfidence());
        actual.setCreatedAt(LocalDateTime.now());

        // createdBy will be set when current-user
        // authentication is integrated.

        KpiActual savedActual = kpiActualRepository.save(actual);

        return KpiActualMapper.toDto(savedActual);
    }

    @Override
    @Transactional(readOnly = true)
    public List<KpiActualDto> getAllActuals() {

        return kpiActualRepository.findAll()
                .stream()
                .map(KpiActualMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public KpiActualDto getActualById(UUID id) {

        KpiActual actual = kpiActualRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "KPI actual not found"));

        return KpiActualMapper.toDto(actual);
    }

    @Override
    public KpiActualDto updateActual(
            UUID id,
            KpiActualRequestDto requestDto) {

        KpiActual actual = kpiActualRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "KPI actual not found"));

        boolean valueChanged =
                actual.getActualValue()
                        .compareTo(requestDto.getActualValue()) != 0;

        boolean confidenceChanged =
                actual.getDataConfidence()
                        != requestDto.getDataConfidence();

        if (valueChanged || confidenceChanged) {

            KpiActualHistory history = new KpiActualHistory();

            history.setActual(actual);
            history.setOldActualValue(actual.getActualValue());
            history.setNewActualValue(requestDto.getActualValue());
            history.setOldDataConfidence(actual.getDataConfidence());
            history.setNewDataConfidence(
                    requestDto.getDataConfidence());
            history.setEditReason(requestDto.getEditReason());
            history.setRecordedAt(LocalDateTime.now());

            // recordedBy will be set when current-user
            // authentication is integrated.

            kpiActualHistoryRepository.save(history);

            actual.setActualValue(requestDto.getActualValue());
            actual.setDataConfidence(
                    requestDto.getDataConfidence());
            actual.setUpdatedAt(LocalDateTime.now());

            // updatedBy will be set when current-user
            // authentication is integrated.
        }

        KpiActual updatedActual =
                kpiActualRepository.save(actual);

        return KpiActualMapper.toDto(updatedActual);
    }

    @Override
    public void deleteActual(UUID id) {

        KpiActual actual = kpiActualRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "KPI actual not found"));

        kpiActualRepository.delete(actual);
    }

    @Override
    public List<KpiActualObservationDto> getActualHistory(UUID kpiId) {

        return kpiActualRepository
                .findByKpi_IdOrderByPeriod_PeriodStartAsc(kpiId)
                .stream()
                .map(KpiActualMapper::toObservationDto)
                .toList();
    }
}