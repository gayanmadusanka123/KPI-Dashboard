package com.ucsc.external_data_service.Repositoy;

import com.ucsc.external_data_service.Entity.ExternalIndicators;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ExternalIndicatorRepository extends JpaRepository<ExternalIndicators, Long> {

    Optional<ExternalIndicators> findByProviderAndIndicatorCodeAndObservationDate(String provider, String indicatorCode, LocalDate observationDate);

    List<ExternalIndicators> findByProviderAndIndicatorCodeAndObservationDateBetweenOrderByObservationDateAsc(String provider, String indicatorCode, LocalDate startDate, LocalDate endDate);
}
