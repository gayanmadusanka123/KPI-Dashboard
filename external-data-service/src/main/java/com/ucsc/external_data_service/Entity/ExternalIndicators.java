package com.ucsc.external_data_service.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "external_indicators")
public class ExternalIndicators {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false,length = 50)
    private String provider;

    private String indicatorCode;

    @Column(nullable = false)
    private String indicatorName;

    @Column(nullable = false,name = "observation_date")
    private LocalDate observationDate;

    @Column(nullable = false)
    private Double value;

    @Column(length = 50)
    private String unit;

    @Column(nullable = false)
    private String source;



}
