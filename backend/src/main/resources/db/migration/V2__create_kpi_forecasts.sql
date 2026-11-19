
CREATE TABLE kpi_forecasts (
                               id UUID PRIMARY KEY,
                               kpi_id UUID NOT NULL,
                               forecast_date DATE NOT NULL,
                               forecast_value NUMERIC(19, 6) NOT NULL,
                               lower_bound NUMERIC(19, 6),
                               upper_bound NUMERIC(19, 6),
                               model_name VARCHAR(50) NOT NULL,
                               generated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                               CONSTRAINT fk_kpi_forecasts_kpi
                                   FOREIGN KEY (kpi_id)
                                       REFERENCES kpis(id)
                                       ON DELETE CASCADE
);

CREATE INDEX idx_kpi_forecasts_kpi_date
    ON kpi_forecasts(kpi_id, forecast_date);

CREATE INDEX idx_kpi_forecasts_generated_at
    ON kpi_forecasts(generated_at);
