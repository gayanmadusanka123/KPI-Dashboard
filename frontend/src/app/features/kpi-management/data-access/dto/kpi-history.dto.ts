import { DataConfidence } from '../../models/kpi.models';

export interface KpiTargetHistoryDto {
  id: string;
  targetId: string;
  oldTargetValue: number;
  newTargetValue: number;
  editReason: string | null;
  recordedAt: string;
  recordedById: string | null;
}

export interface KpiActualHistoryDto {
  id: string;
  actualId: string;
  oldActualValue: number;
  newActualValue: number;
  oldDataConfidence: DataConfidence;
  newDataConfidence: DataConfidence;
  editReason: string | null;
  recordedAt: string;
  recordedById: string | null;
}
