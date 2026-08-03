package com.ucsc.kpi_dashboard.Service.Implimentation;

import com.ucsc.kpi_dashboard.Domain.KpiTypes;
import com.ucsc.kpi_dashboard.Mapper.KpiProfileMapper;
import com.ucsc.kpi_dashboard.Model.KpiProfile;
import com.ucsc.kpi_dashboard.Model.KpiValues;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiProfileDto;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiValueDto;
import com.ucsc.kpi_dashboard.Repository.KpiProfileRepository;
import com.ucsc.kpi_dashboard.Repository.KpiValuesRepository;
import com.ucsc.kpi_dashboard.Service.KPIService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class KpiServiceImpl implements KPIService {

    private final KpiProfileRepository kpiProfileRepository;
    private final KpiValuesRepository kpiValuesRepository;




    @Override
    public List<KpiProfileDto> getAllKpiProfiles() {

        return kpiProfileRepository.findAll().stream().map(KpiProfileMapper::toDto).toList();
    }

    @Override
    public KpiProfileDto getKpiProfileByType(KpiTypes kpiTypes) {

        KpiProfile kpiProfile = kpiProfileRepository.findByType(kpiTypes);
        return KpiProfileMapper.toDto(kpiProfile);
    }

    @Override
    public KpiValueDto saveKpiValue(KpiTypes kpiTypes, double actualValue, LocalDate date) {

        KpiProfile kpiProfile = kpiProfileRepository.findByType(kpiTypes);
        KpiValues kpiValues = new KpiValues(kpiProfile,actualValue,date);

        //double score = KpiCaculator.normalize(kpiProfile,actualValue);
        return null;
    }

    @Override
    public List<KpiValueDto> getValueByProfile(KpiTypes kpiTypes) {
        return List.of();
    }
}
