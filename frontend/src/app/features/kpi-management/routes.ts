import {Routes} from '@angular/router';
import {KpiManagement} from './pages/kpi-management/kpi-management';
import { KpiDetail } from './pages/kpi-detail/kpi-detail';

export const KPI_MANAGEMENT_ROUTES: Routes = [
  {
    path: ':id',
    component: KpiDetail
  },
  {
    path: '',
    component: KpiManagement
  }
];