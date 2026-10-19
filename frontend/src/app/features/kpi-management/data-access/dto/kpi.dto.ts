import { KpiActiveStatus, KpiDirection } from '../../models/kpi.models';

export interface KpiDto {
  id: string;
  kpiCode: string;
  name: string;
  description: string | null;
  categoryId: string | null;
  categoryName: string | null;
  departmentId: string | null;
  departmentName: string | null;
  ownerId: string | null;
  ownerName: string | null;
  dataSource: string | null;
  measurementUnit: string | null;
  reportingFrequency: string | null;
  directionOfGood: KpiDirection | null;
  status: KpiActiveStatus;
  notes: string | null;
  createdAt: string;
  createdById: string | null;
  updatedAt: string;
  updatedById: string | null;
}

export interface KpiRequestDto {
  name: string;
  description?: string | null;
  categoryId?: string | null;
  departmentId?: string | null;
  ownerId?: string | null;
  dataSource?: string | null;
  measurementUnit?: string | null;
  reportingFrequency?: string | null;
  directionOfGood?: KpiDirection | null;
  status: KpiActiveStatus;
  notes?: string | null;
}
