import { KpiActiveStatus } from '../../models/kpi.models';

export interface KpiCategoryDto {
  id: string;
  name: string;
  description: string | null;
  status: KpiActiveStatus;
}

export interface DepartmentDto {
  id: string;
  name: string;
  description: string | null;
  status: KpiActiveStatus;
}

export interface UserDto {
  id: string;
  userName: string;
  email: string;
  role: string | null;
  status: KpiActiveStatus | null;
  departmentId: string | null;
}
