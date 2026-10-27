import { KpiActiveStatus, KpiStatus } from './kpi.models';

export type KpiSortDirection = 'asc' | 'desc';

export interface KpiFilters {
  search: string;
  categoryId: string | null;
  departmentId: string | null;
  ownerId: string | null;
  status: KpiActiveStatus | null;
  performanceStatus: KpiStatus | null;
  sortBy: string;
  sortDirection: KpiSortDirection;
  page: number;
  size: number;
}

export const DEFAULT_KPI_FILTERS: KpiFilters = {
  search: '',
  categoryId: null,
  departmentId: null,
  ownerId: null,
  status: null,
  performanceStatus: null,
  sortBy: 'updatedAt',
  sortDirection: 'desc',
  page: 0,
  size: 20
};
