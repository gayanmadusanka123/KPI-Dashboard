package com.ucsc.kpi_dashboard.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "kpi_tags")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class KpiTag {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @NotNull
    @NotBlank
    @Column(unique = true, nullable = false)
    private String name;

    private LocalDateTime createdAt;
}
