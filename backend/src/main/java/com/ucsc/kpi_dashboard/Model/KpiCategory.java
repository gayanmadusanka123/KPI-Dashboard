package com.ucsc.kpi_dashboard.Model;

import com.ucsc.kpi_dashboard.Domain.ActiveStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "kpi_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class KpiCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @NotNull
    @NotBlank
    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActiveStatus status;
}