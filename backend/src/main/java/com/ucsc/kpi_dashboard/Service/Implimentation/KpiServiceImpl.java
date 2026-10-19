package com.ucsc.kpi_dashboard.Service.Implimentation;

import com.ucsc.kpi_dashboard.Domain.KpiTypes;
import com.ucsc.kpi_dashboard.Exeptions.UserException;
import com.ucsc.kpi_dashboard.Mapper.KpiProfileMapper;
import com.ucsc.kpi_dashboard.Mapper.KpiValueMapper;
import com.ucsc.kpi_dashboard.Model.KpiProfile;
import com.ucsc.kpi_dashboard.Model.KpiValues;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiProfileDto;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiValueDto;
import com.ucsc.kpi_dashboard.Repository.KpiProfileRepository;
import com.ucsc.kpi_dashboard.Repository.KpiValuesRepository;
import com.ucsc.kpi_dashboard.Service.KPIService;
import com.ucsc.kpi_dashboard.Util.KpiCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class KpiServiceImpl implements KPIService {

    private final KpiProfileRepository kpiProfileRepository;
    private final KpiValuesRepository kpiValuesRepository;
    private final KpiCalculator kpiCalculator;

    @Override
    public List<KpiProfileDto> getAllKpiProfiles() {

        return kpiProfileRepository.findAll().stream().map(KpiProfileMapper::toDto).toList();
    }

    @Override
    public KpiProfileDto getKpiProfileByType(KpiTypes kpiTypes) throws UserException {
        KpiProfile kpiProfile = kpiProfileRepository.findByKpiType(kpiTypes).orElseThrow(
                () -> new UserException("Missing KPI profile :" + kpiTypes)
        );
        return KpiProfileMapper.toDto(kpiProfile);
    }


    @Override
    public KpiValueDto saveKpiValue(KpiTypes kpiTypes, double actualValue, LocalDate date) throws UserException {

        KpiProfile kpiProfile = kpiProfileRepository.findByKpiType(kpiTypes).orElseThrow(
                () -> new UserException("Missing kpi type : " + kpiTypes)
        );
        KpiValues kpiValues = new KpiValues();
        kpiValues.setActualValue(actualValue);
        kpiValues.setKpiProfile(kpiProfile);
        kpiValues.setValueDate(date);

        KpiValues savedValue = kpiValuesRepository.save(kpiValues);

        KpiCalculator.CalculationResult result = kpiCalculator.calculationResult(kpiProfile, actualValue);

        return KpiValueMapper.toDto(savedValue, result.status(), result.normalizedScore());

    }


    @Override
    public List<KpiValueDto> getValueByType(KpiTypes kpiTypes) throws UserException {
        KpiProfile kpiProfile = kpiProfileRepository.findByKpiType(kpiTypes).orElseThrow(
                () -> new UserException("Missing KPI type :" + kpiTypes)
        );

        return kpiValuesRepository.findByKpiProfileIdOrderByValueDateDesc(kpiProfile.getId()).stream().map(
                kpiValues -> {
                    KpiCalculator.CalculationResult calculationResult = kpiCalculator.calculationResult(kpiProfile, kpiValues.getActualValue());

                    return KpiValueMapper.toDto(kpiValues, calculationResult.status(), calculationResult.normalizedScore());
                }
        ).toList();
    }
}
