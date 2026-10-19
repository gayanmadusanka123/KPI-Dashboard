export interface KpiPeriodDto {
  id: string;
  kpiId: string;
  periodStart: string;
  periodEnd: string;
  periodLabel: string | null;
  periodSequence: number | null;
  createdAt: string;
}

export interface KpiPeriodRequestDto {
  kpiId: string;
  periodStart: string;
  periodEnd: string;
  periodLabel?: string | null;
  periodSequence?: number | null;
}
