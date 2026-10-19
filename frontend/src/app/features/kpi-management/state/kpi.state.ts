import { KpiDetails } from '../models/kpi.models';
import {
  DEFAULT_KPI_FILTERS,
  KpiFilters
} from '../models/kpi-filter.models';

export interface KpiState {
  kpis: KpiDetails[];
  selectedKpi: KpiDetails | null;
  filters: KpiFilters;
  totalItems: number;
  totalPages: number;
  loading: boolean;
  loadingDetails: boolean;
  saving: boolean;
  deleting: boolean;
  error: string | null;
}

export const initialKpiState: KpiState = {
  kpis: [],
  selectedKpi: null,
  filters: { ...DEFAULT_KPI_FILTERS },
  totalItems: 0,
  totalPages: 0,
  loading: false,
  loadingDetails: false,
  saving: false,
  deleting: false,
  error: null
};
