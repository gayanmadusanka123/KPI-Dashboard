package com.ucsc.kpi_dashboard.Model;

import com.ucsc.kpi_dashboard.Domain.ActiveStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "kpis")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Kpi {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @NotNull
    @NotBlank
    @Column(unique = true, nullable = false)
    private String kpiCode;

    @NotNull
    @NotBlank
    @Column(nullable = false)
    private String name;

    private String description;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private KpiCategory category;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    private String dataSource;

    private String measurementUnit;

    private String reportingFrequency;

    private String directionOfGood;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActiveStatus status;

    private String notes;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "updated_by")
    private User updatedBy;
}
