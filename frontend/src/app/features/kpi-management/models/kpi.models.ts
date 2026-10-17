export type KpiStatus = 'Exceeded' | 'On Track' | 'At Risk' | 'Off Track';
export type KpiTrend = 'up' | 'down' | 'flat';

export interface ReportingPeriod {
  period: string;
  targetValue: number;
  actualValue: number | null;
  performanceScore: number | null;
  variance: number | null;
  variancePct: number | null;
  status: KpiStatus;
  notes: string;
  dataConfidence: 'High' | 'Medium' | 'Low';
  enteredAt: string;
}

export interface Kpi {
  id: string;
  name: string;
  category: string;
  dept: string;
  owner: string;
  frequency: string;
  target: string;
  actual: string;
  score: number;
  status: KpiStatus;
  trend: KpiTrend;
  updated: string;
  reportingHistory: ReportingPeriod[];
  directionOfGood?: 'Higher is Better' | 'Lower is Better';
}