export interface PerformancePeriod {
  periodId: string;
  periodLabel: string;
  periodStart: string;
  periodEnd: string;

  actualValue: number | null;
  targetValue: number | null;

  performanceScore: number | null;
  variance: number | null;
  variancePercent: number | null;
  periodChangePercent: number | null;

  trendDirection: string | null;
  rollingAverage: number | null;
  cumulativePerformance: number | null;
  status: string | null;
}

export interface KpiPerformance {
  kpiId: string;
  kpiName: string;
  directionOfGood: string;
  periods: PerformancePeriod[];
}

export interface KpiPerformanceSummary {
  kpiId: string;
  kpiName: string;
  department: string;

  latestScore: number | null;
  latestStatus: string | null;
  latestTrend: string | null;
}

export interface OverallPerformanceSummary {
  totalKpis: number;
  kpisWithResults: number;
  averagePerformance: number | null;

  exceededCount: number;
  onTrackCount: number;
  atRiskCount: number;
  offTrackCount: number;
}

export interface DepartmentPerformance {
  department: string;
  averageScore: number;
  kpiCount: number;
}