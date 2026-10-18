import { KpiActiveStatus, KpiDirection, DataConfidence } from './kpi.models';

export interface CreateKpiFormValue {
  name: string;
  categoryId: string | null;
  departmentId: string | null;
  ownerId: string | null;
  description: string;
  dataSource: string;
  measurementUnit: string;
  reportingFrequency: string;
  directionOfGood: KpiDirection;
  status: KpiActiveStatus;
  notes: string;
}

export type UpdateKpiFormValue = CreateKpiFormValue;

export interface ReportingPeriodFormValue {
  periodStart: string;
  periodEnd: string;
  periodLabel: string;
  targetValue: number;
  actualValue: number | null;
  dataConfidence: DataConfidence;
  notes: string;
}
