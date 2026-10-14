package com.ucsc.kpi_dashboard.Service.Implimentation;

import com.ucsc.kpi_dashboard.Mapper.KpiPeriodMapper;
import com.ucsc.kpi_dashboard.Model.Kpi;
import com.ucsc.kpi_dashboard.Model.KpiPeriod;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiPeriodDto;
import com.ucsc.kpi_dashboard.Repository.KpiPeriodRepository;
import com.ucsc.kpi_dashboard.Repository.KpiRepository;
import com.ucsc.kpi_dashboard.Service.KpiPeriodService;
import com.ucsc.kpi_dashboard.Exeptions.ResourceNotFoundException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class KpiPeriodServiceImpl implements KpiPeriodService {

    private final KpiPeriodRepository kpiPeriodRepository;
    private final KpiRepository kpiRepository;

    public KpiPeriodServiceImpl(
            KpiPeriodRepository kpiPeriodRepository,
            KpiRepository kpiRepository
    ) {
        this.kpiPeriodRepository = kpiPeriodRepository;
        this.kpiRepository = kpiRepository;
    }

    @Override
    public KpiPeriodDto createPeriod(KpiPeriodDto periodDto) {

        validatePeriodDates(
                periodDto.getPeriodStart(),
                periodDto.getPeriodEnd()
        );

        Kpi kpi = kpiRepository.findById(periodDto.getKpiId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "KPI not found with id: " + periodDto.getKpiId()
                ));

        KpiPeriod period = new KpiPeriod();

        period.setKpi(kpi);
        period.setPeriodStart(periodDto.getPeriodStart());
        period.setPeriodEnd(periodDto.getPeriodEnd());
        period.setPeriodLabel(periodDto.getPeriodLabel());
        period.setPeriodSequence(periodDto.getPeriodSequence());
        period.setCreatedAt(LocalDateTime.now());

        KpiPeriod savedPeriod = kpiPeriodRepository.save(period);

        return KpiPeriodMapper.toDto(savedPeriod);
    }

    @Override
    @Transactional(readOnly = true)
    public List<KpiPeriodDto> getAllPeriods() {

        return kpiPeriodRepository.findAll()
                .stream()
                .map(KpiPeriodMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public KpiPeriodDto getPeriodById(UUID id) {

        KpiPeriod period = kpiPeriodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "KPI Period not found with id: " + id
                ));

        return KpiPeriodMapper.toDto(period);
    }

    @Override
    public KpiPeriodDto updatePeriod(UUID id, KpiPeriodDto periodDto) {

        KpiPeriod period = kpiPeriodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "KPI Period not found with id: " + id
                ));

        validatePeriodDates(
                periodDto.getPeriodStart(),
                periodDto.getPeriodEnd()
        );

        Kpi periodKpi = kpiRepository.findById(periodDto.getKpiId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "KPI not found with id: " + periodDto.getKpiId()
                ));

        period.setKpi(periodKpi);
        period.setPeriodStart(periodDto.getPeriodStart());
        period.setPeriodEnd(periodDto.getPeriodEnd());
        period.setPeriodLabel(periodDto.getPeriodLabel());
        period.setPeriodSequence(periodDto.getPeriodSequence());

        KpiPeriod updatedPeriod = kpiPeriodRepository.save(period);

        return KpiPeriodMapper.toDto(updatedPeriod);
    }

    @Override
    public void deletePeriod(UUID id) {

        KpiPeriod period = kpiPeriodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "KPI Period not found with id: " + id
                ));

        kpiPeriodRepository.delete(period);
    }

    private void validatePeriodDates(
            java.time.LocalDate start,
            java.time.LocalDate end
    ) {
        if (start == null || end == null) {
            throw new IllegalArgumentException(
                    "Period start and end dates are required"
            );
        }

        if (end.isBefore(start)) {
            throw new IllegalArgumentException(
                    "Period end date cannot be before the start date"
            );
        }
    }
}