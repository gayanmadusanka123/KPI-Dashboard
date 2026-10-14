package com.ucsc.kpi_dashboard.Service.Implimentation;

import com.ucsc.kpi_dashboard.Mapper.KpiMapper;
import com.ucsc.kpi_dashboard.Model.Department;
import com.ucsc.kpi_dashboard.Model.Kpi;
import com.ucsc.kpi_dashboard.Model.KpiCategory;
import com.ucsc.kpi_dashboard.Model.User;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiDto;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiRequestDto;
import com.ucsc.kpi_dashboard.Repository.DepartmentRepository;
import com.ucsc.kpi_dashboard.Repository.KpiCategoryRepository;
import com.ucsc.kpi_dashboard.Repository.KpiRepository;
import com.ucsc.kpi_dashboard.Repository.UserRepository;
import com.ucsc.kpi_dashboard.Service.KpiService;
import com.ucsc.kpi_dashboard.Exeptions.ResourceNotFoundException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class KpiServiceImpl implements KpiService {

    private final KpiRepository kpiRepository;
    private final KpiCategoryRepository kpiCategoryRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    public KpiServiceImpl(
            KpiRepository kpiRepository,
            KpiCategoryRepository kpiCategoryRepository,
            DepartmentRepository departmentRepository,
            UserRepository userRepository
    ) {
        this.kpiRepository = kpiRepository;
        this.kpiCategoryRepository = kpiCategoryRepository;
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
    }

    @Override
    public KpiDto createKpi(KpiRequestDto requestDto) {

        Kpi kpi = new Kpi();

        kpi.setKpiCode(generateKpiCode());
        kpi.setName(requestDto.getName());
        kpi.setDescription(requestDto.getDescription());
        kpi.setCategory(resolveCategory(requestDto.getCategoryId()));
        kpi.setDepartment(resolveDepartment(requestDto.getDepartmentId()));
        kpi.setOwner(resolveOwner(requestDto.getOwnerId()));
        kpi.setDataSource(requestDto.getDataSource());
        kpi.setMeasurementUnit(requestDto.getMeasurementUnit());
        kpi.setReportingFrequency(requestDto.getReportingFrequency());
        kpi.setDirectionOfGood(requestDto.getDirectionOfGood());
        kpi.setStatus(requestDto.getStatus());
        kpi.setNotes(requestDto.getNotes());
        kpi.setCreatedAt(LocalDateTime.now());

        Kpi savedKpi = kpiRepository.save(kpi);

        return KpiMapper.toDto(savedKpi);
    }

    @Override
    @Transactional(readOnly = true)
    public List<KpiDto> getAllKpis() {

        return kpiRepository.findAll()
                .stream()
                .map(KpiMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public KpiDto getKpiById(UUID id) {

        Kpi kpi = kpiRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "KPI not found with id: " + id
                ));

        return KpiMapper.toDto(kpi);
    }

    @Override
    public KpiDto updateKpi(UUID id, KpiRequestDto requestDto) {

        Kpi kpi = kpiRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "KPI not found with id: " + id
                ));

        kpi.setName(requestDto.getName());
        kpi.setDescription(requestDto.getDescription());
        kpi.setCategory(resolveCategory(requestDto.getCategoryId()));
        kpi.setDepartment(resolveDepartment(requestDto.getDepartmentId()));
        kpi.setOwner(resolveOwner(requestDto.getOwnerId()));
        kpi.setDataSource(requestDto.getDataSource());
        kpi.setMeasurementUnit(requestDto.getMeasurementUnit());
        kpi.setReportingFrequency(requestDto.getReportingFrequency());
        kpi.setDirectionOfGood(requestDto.getDirectionOfGood());
        kpi.setStatus(requestDto.getStatus());
        kpi.setNotes(requestDto.getNotes());
        kpi.setUpdatedAt(LocalDateTime.now());

        Kpi updatedKpi = kpiRepository.save(kpi);

        return KpiMapper.toDto(updatedKpi);
    }

    @Override
    public void deleteKpi(UUID id) {

        Kpi kpi = kpiRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "KPI not found with id: " + id
                ));

        kpiRepository.delete(kpi);
    }

    private String generateKpiCode() {
        return "KPI-" + UUID.randomUUID()
                .toString()
                .substring(0, 8)
                .toUpperCase();
    }

    private KpiCategory resolveCategory(UUID categoryId) {
        if (categoryId == null) {
            return null;
        }

        return kpiCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "KPI Category not found with id: " + categoryId
                ));
    }

    private Department resolveDepartment(UUID departmentId) {
        if (departmentId == null) {
            return null;
        }

        return departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Department not found with id: " + departmentId
                ));
    }

    private User resolveOwner(UUID ownerId) {
        if (ownerId == null) {
            return null;
        }

        return userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + ownerId
                ));
    }
}