package com.ucsc.kpi_dashboard.Service.Implimentation;

import com.ucsc.kpi_dashboard.Mapper.KpiCategoryMapper;
import com.ucsc.kpi_dashboard.Model.KpiCategory;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiCategoryDto;
import com.ucsc.kpi_dashboard.Repository.KpiCategoryRepository;
import com.ucsc.kpi_dashboard.Service.KpiCategoryService;
import com.ucsc.kpi_dashboard.Exeptions.ResourceNotFoundException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class KpiCategoryServiceImpl implements KpiCategoryService {

    private final KpiCategoryRepository kpiCategoryRepository;

    public KpiCategoryServiceImpl(
            KpiCategoryRepository kpiCategoryRepository) {
        this.kpiCategoryRepository = kpiCategoryRepository;
    }

    @Override
    public KpiCategoryDto createCategory(KpiCategoryDto dto) {

        KpiCategory category = KpiCategoryMapper.toEntity(dto);

        KpiCategory savedCategory =
                kpiCategoryRepository.save(category);

        return KpiCategoryMapper.toDto(savedCategory);
    }

    @Override
    @Transactional(readOnly = true)
    public List<KpiCategoryDto> getAllCategories() {

        return kpiCategoryRepository.findAll()
                .stream()
                .map(KpiCategoryMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public KpiCategoryDto getCategoryById(UUID id) {

        KpiCategory category = kpiCategoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "KPI category not found with ID: " + id));

        return KpiCategoryMapper.toDto(category);
    }

    @Override
    public KpiCategoryDto updateCategory(
            UUID id, KpiCategoryDto dto) {

        KpiCategory category = kpiCategoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "KPI category not found with ID: " + id));

        KpiCategoryMapper.updateEntity(dto, category);

        KpiCategory updatedCategory =
                kpiCategoryRepository.save(category);

        return KpiCategoryMapper.toDto(updatedCategory);
    }

    @Override
    public void deleteCategory(UUID id) {

        KpiCategory category = kpiCategoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "KPI category not found with ID: " + id));

        kpiCategoryRepository.delete(category);
    }
}
