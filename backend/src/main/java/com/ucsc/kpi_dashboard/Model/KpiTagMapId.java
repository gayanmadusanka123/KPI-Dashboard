package com.ucsc.kpi_dashboard.Model;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class KpiTagMapId implements Serializable {

    private UUID kpiId;

    private UUID tagId;
}