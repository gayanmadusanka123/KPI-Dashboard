package com.ucsc.kpi_dashboard.Service.Implimentation;

import com.ucsc.kpi_dashboard.Exeptions.ResourceNotFoundException;
import com.ucsc.kpi_dashboard.Model.Kpi;
import com.ucsc.kpi_dashboard.Model.KpiActual;
import com.ucsc.kpi_dashboard.Model.KpiTarget;
import com.ucsc.kpi_dashboard.Payload.Dto.Performance.PerformanceInputDto;
import com.ucsc.kpi_dashboard.Payload.Dto.Performance.PerformancePeriodInputDto;
import com.ucsc.kpi_dashboard.Repository.KpiActualRepository;
import com.ucsc.kpi_dashboard.Repository.KpiRepository;
import com.ucsc.kpi_dashboard.Repository.KpiTargetRepository;
import com.ucsc.kpi_dashboard.Service.PerformanceInputService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PerformanceInputServiceImpl implements PerformanceInputService {

    private final KpiRepository kpiRepository;
    private final KpiActualRepository kpiActualRepository;
    private final KpiTargetRepository kpiTargetRepository;

    public Kpi findKpi(UUID kpiId) {
        Kpi kpi = kpiRepository.findById(kpiId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("KPI not found"));

        return kpi;
    }

    public List<KpiActual> retrieveActuals(UUID kpiId) {
        List<KpiActual> kpiActuals = kpiActualRepository.findByKpi_IdOrderByPeriod_PeriodStartAsc(kpiId);

        return kpiActuals;
    }

    public List<KpiTarget> retrieveTargets(UUID kpiId) {
        List<KpiTarget> kpiTargets = kpiTargetRepository.findByKpi_IdOrderByPeriod_PeriodStartAsc(kpiId);

        return kpiTargets;
    }

    private Map<UUID, KpiTarget> map(List<KpiTarget> targets){
        return targets.stream()
                .collect(Collectors.toMap(
                        target -> target.getPeriod().getId(),
                        target -> target
                ));
    }

    @Override
    public PerformanceInputDto getPerformanceInputs(UUID kpiId) {
        Kpi kpi = findKpi(kpiId);
        List<KpiActual> kpiActuals = retrieveActuals(kpiId);
        List<KpiTarget> kpiTargets = retrieveTargets(kpiId);
        Map<UUID, KpiTarget> targetMap = map(kpiTargets);

        List<PerformancePeriodInputDto> periodInputs = new ArrayList<>();

        for(KpiActual actual : kpiActuals){
            KpiTarget target = targetMap.get(actual.getPeriod().getId());

            if(target == null){
                continue;
            }

            PerformancePeriodInputDto periodInput =  new PerformancePeriodInputDto();

            periodInput.setPeriodId(actual.getPeriod().getId());
            periodInput.setPeriodStart(actual.getPeriod().getPeriodStart());
            periodInput.setPeriodEnd(actual.getPeriod().getPeriodEnd());
            periodInput.setActualValue(actual.getActualValue());
            periodInput.setTargetValue(target.getTargetValue());

            periodInputs.add(periodInput);
        }

        PerformanceInputDto response = new  PerformanceInputDto();

        response.setKpiId(kpi.getId());
        response.setKpiName(kpi.getName());
        response.setDirectionOfGood(kpi.getDirectionOfGood());
        response.setPeriods(periodInputs);

        return response;
    }
}
