import { DataConfidence } from '../../models/kpi.models';

export interface KpiActualDto {
  id: string;
  kpiId: string;
  periodId: string;
  actualValue: number;
  dataConfidence: DataConfidence;
  createdAt: string;
  createdById: string | null;
  updatedAt: string;
  updatedById: string | null;
}

export interface KpiActualRequestDto {
  kpiId: string;
  periodId: string;
  actualValue: number;
  dataConfidence: DataConfidence;
  editReason?: string | null;
}
