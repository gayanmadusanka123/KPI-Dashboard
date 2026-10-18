export type KpiStatus = 'Exceeded' | 'On Track' | 'At Risk' | 'Off Track' | 'Awaiting actual';
export type KpiTrend = 'up' | 'down' | 'flat';
export type KpiDirection = 'Higher is Better' | 'Lower is Better';
export type DataConfidence = 'High' | 'Medium' | 'Low';

export interface ReportingPeriod {
  id?: string;
  kpiId?: string;
  periodId?: string;
  period: string;
  periodStart?: string;
  periodEnd?: string;
  targetValue: number;
  actualValue: number | null;
  performanceScore: number | null;
  variance: number | null;
  variancePct: number | null;
  status: KpiStatus;
  notes: string;
  dataConfidence: DataConfidence;
  enteredAt: string;
}

export interface Kpi {
  id: string;
  code?: string;
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
  directionOfGood?: KpiDirection;
  description?: string;
  dataSource?: string;
  measurementUnit?: string;
  notes?: string;
  activeStatus?: KpiActiveStatus;
}

export type KpiActiveStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface KpiDetails extends Kpi {
  categoryId?: string | null;
  departmentId?: string | null;
  ownerId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}