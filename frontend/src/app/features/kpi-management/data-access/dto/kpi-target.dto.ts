export interface KpiTargetDto {
  id: string;
  kpiId: string;
  periodId: string;
  targetValue: number;
  createdAt: string;
  createdById: string | null;
  updatedAt: string;
  updatedById: string | null;
}

export interface KpiTargetRequestDto {
  kpiId: string;
  periodId: string;
  targetValue: number;
  editReason?: string | null;
}
