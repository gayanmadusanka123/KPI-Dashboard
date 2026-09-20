package com.ucsc.kpi_dashboard.Service.Implimentation;

import com.ucsc.kpi_dashboard.Exeptions.KPIException;
import com.ucsc.kpi_dashboard.Mapper.KPIMapper;
import com.ucsc.kpi_dashboard.Model.*;
import com.ucsc.kpi_dashboard.Payload.Dto.KPIDto;
import com.ucsc.kpi_dashboard.Repository.*;
import com.ucsc.kpi_dashboard.Service.KPIService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class KPIServiceImpl implements KPIService {
    private final KPIRepository kpiRepository;

    private final KpiCategoryRepository kpiCategoryRepository;

    private final DepartmentRepository departmentRepository;

    private final UserRepository userRepository;

    private final TagRepository tagRepository;

    @Override
    public KPIDto createKPI(KPIDto dto) throws KPIException {

        KPI kpi = KPIMapper.toEntity(dto);


        // Find Category
        if (dto.getCategoryId() != null) {

            KpiCategory category = kpiCategoryRepository
                    .findById(dto.getCategoryId())
                    .orElseThrow(() ->
                            new KPIException("Category not found")
                    );

            kpi.setCategory(category);
        }


        // Find Department
        if (dto.getDepartmentId() != null) {

            Department department = departmentRepository
                    .findById(dto.getDepartmentId())
                    .orElseThrow(() ->
                            new KPIException("Department not found")
                    );

            kpi.setDepartment(department);
        }


        // Find KPI Owner
        if (dto.getOwnerId() != null) {

            User owner = userRepository
                    .findById(dto.getOwnerId())
                    .orElseThrow(() ->
                            new KPIException("Owner not found")
                    );

            kpi.setOwner(owner);
        }


        // Find Tags
        if (dto.getTagIds() != null && !dto.getTagIds().isEmpty()) {

            List<Tag> tags = tagRepository
                    .findAllById(dto.getTagIds());

            kpi.setTags(tags);
        }


        KPI savedKpi = kpiRepository.save(kpi);


        return KPIMapper.toDto(savedKpi);
    }

    @Override
    public KPIDto updateKPI(Long id, KPIDto dto) throws KPIException {

        KPI existingKpi = kpiRepository.findById(id)
                .orElseThrow(() ->
                        new KPIException("KPI not found")
                );


        // Update basic fields
        existingKpi.setKpiName(dto.getKpiName());
        existingKpi.setKpiDescription(dto.getKpiDescription());

        existingKpi.setDataSource(dto.getDataSource());
        existingKpi.setMeasurementUnit(dto.getMeasurementUnit());
        existingKpi.setReportingFrequency(dto.getReportingFrequency());
        existingKpi.setDirectionOfGood(dto.getDirectionOfGood());

        existingKpi.setStatus(dto.getStatus());
        existingKpi.setNotes(dto.getNotes());


        // Update Category
        if (dto.getCategoryId() != null) {

            KpiCategory category = kpiCategoryRepository
                    .findById(dto.getCategoryId())
                    .orElseThrow(() ->
                            new KPIException("Category not found")
                    );

            existingKpi.setCategory(category);
        }


        // Update Department
        if (dto.getDepartmentId() != null) {

            Department department = departmentRepository
                    .findById(dto.getDepartmentId())
                    .orElseThrow(() ->
                            new KPIException("Department not found")
                    );

            existingKpi.setDepartment(department);
        }


        // Update Owner
        if (dto.getOwnerId() != null) {

            User owner = userRepository
                    .findById(dto.getOwnerId())
                    .orElseThrow(() ->
                            new KPIException("Owner not found")
                    );

            existingKpi.setOwner(owner);
        }


        // Update Tags
        if (dto.getTagIds() != null) {

            List<Tag> tags = tagRepository
                    .findAllById(dto.getTagIds());

            existingKpi.setTags(tags);
        }


        KPI updatedKpi = kpiRepository.save(existingKpi);


        return KPIMapper.toDto(updatedKpi);
    }

    @Override
    public KPIDto getKPIById(Long id) throws KPIException {
        KPI kpi = kpiRepository.findById(id)
                .orElseThrow(() -> new KPIException("KPI not found"));

        return KPIMapper.toDto(kpi);
    }

    @Override
    public List<KPIDto> getAllKPIs() throws KPIException {
        List<KPI> kpis = kpiRepository.findAll();

        return kpis.stream()
                .map(KPIMapper::toDto)
                .toList();
    }

    @Override
    public void deleteKPI(Long id) throws KPIException {
        KPI kpi = kpiRepository.findById(id)
                .orElseThrow(() -> new KPIException("KPI not found"));

        kpiRepository.delete(kpi);
    }
}

