package com.ucsc.external_data_service.Service;

import com.ucsc.external_data_service.Connector.ConnectorRegistry;
import com.ucsc.external_data_service.Connector.ExternalDataConnector;
import com.ucsc.external_data_service.Dto.ExternalDataIndicatorResponse;
import com.ucsc.external_data_service.Entity.ExternalIndicators;
import com.ucsc.external_data_service.Repositoy.ExternalIndicatorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExternalDataService {

    /*

    1. Validate the request.
2. Select the connector.
3. Check Redis through @Cacheable.
4. Call World Bank or FRED if not cached.
5. Save normalized data to PostgreSQL.
6. Return the result.
7. Use PostgreSQL as fallback if the provider is unavailable.*/

    private final ConnectorRegistry connectorRegistry;
    private final ExternalIndicatorRepository externalIndicatorRepository;

    @Transactional
    @Cacheable(
            cacheNames = "external-indicators",
            key = "#provider.toUpperCase() + ':' " +
                    "+ #indicatorCode + ':' " +
                    "#startDate + ':' + #endDate"
    )
    public List<ExternalDataIndicatorResponse> fetchDataAndSave(
            String provider,
            String indicatorCode,
            LocalDate startDate,
            LocalDate endDate
    ) {

        validateRequest(
                provider,
                indicatorCode,
                startDate,
                endDate
        );

        String normalizedProvider = normalize(provider);

        ExternalDataConnector externalDataConnector = connectorRegistry.getConnector(normalizedProvider);

        try {
            List<ExternalDataIndicatorResponse> responses = externalDataConnector.getData(
                    indicatorCode,
                    startDate,
                    endDate
            );

            saveAll(responses);

            return responses;
        } catch (Exception e) {

            return loadDataBaseFallBack(
                    normalizedProvider, indicatorCode,
                    startDate, endDate, e
            );

        }

    }

    @CacheEvict(
            cacheNames = "external-indicators",
            allEntries = true
    )
    public void clearCache() {

    }

    @Transactional(readOnly = true)
    public List<ExternalDataIndicatorResponse> getStoredData(
            String provider,
            String indicatorCode,
            LocalDate startDate,
            LocalDate endDate
    ) {
        validateRequest(
                provider,
                indicatorCode,
                startDate,
                endDate
        );

        return externalIndicatorRepository.findByProviderAndIndicatorCodeAndObservationDateBetweenOrderByObservationDateAsc(
                normalize(provider),
                indicatorCode,
                startDate,
                endDate
        ).stream().map(this::toResponse).toList();
    }

    private List<ExternalDataIndicatorResponse> loadDataBaseFallBack(
            String provider,
            String indicatorCode,
            LocalDate startDate,
            LocalDate endDate,
            Exception originalException
    ) {
        List<ExternalIndicators> storedData = externalIndicatorRepository.findByProviderAndIndicatorCodeAndObservationDateBetweenOrderByObservationDateAsc(
                provider,
                indicatorCode,
                startDate,
                endDate
        );

        if (!storedData.isEmpty()) {
            return storedData.stream().map(this::toResponse).toList();
        }

        throw new RuntimeException(
                "External provider failed and no stored " +
                        "fall back data exists",
                originalException
        );
    }

    private ExternalDataIndicatorResponse toResponse(ExternalIndicators externalIndicators) {

        return new ExternalDataIndicatorResponse(
                externalIndicators.getProvider(),
                externalIndicators.getIndicatorCode(),
                externalIndicators.getIndicatorName(),
                externalIndicators.getObservationDate(),
                externalIndicators.getValue(),
                externalIndicators.getUnit(),
                externalIndicators.getSource()
        );
    }

    private void saveAll(List<ExternalDataIndicatorResponse> responses) {
        for (ExternalDataIndicatorResponse dto : responses) {
            ExternalIndicators externalIndicators = externalIndicatorRepository.findByProviderAndIndicatorCodeAndObservationDate(
                            dto.provider(),
                            dto.indicatorCode(),
                            dto.observationDate()
                    )
                    .orElseGet(ExternalIndicators::new);

            externalIndicators.setProvider(dto.provider());
            externalIndicators.setIndicatorCode(dto.indicatorCode());
            externalIndicators.setObservationDate(dto.observationDate());
            externalIndicators.setIndicatorName(dto.indicatorName());
            externalIndicators.setValue(dto.value());
            externalIndicators.setUnit(dto.unit());
            externalIndicators.setSource(dto.source());
            externalIndicatorRepository.save(externalIndicators);
        }
    }

    private String normalize(String provider) {

        return provider.trim().toUpperCase(Locale.ROOT);
    }

    private void validateRequest(String provider, String indicatorCode, LocalDate startDate, LocalDate endDate) {

        if (provider == null || provider.isEmpty()) {
            throw new IllegalArgumentException("provider is required");
        }

        if (indicatorCode == null || indicatorCode.isEmpty()) {
            throw new IllegalArgumentException("indicatorCode is required");
        }

        if (startDate == null) {
            throw new IllegalArgumentException("startDate is required");
        }

        if (endDate == null) {
            throw new IllegalArgumentException("endDate is required");
        }

        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("endDate cannot be before startDate");
        }

    }
}
