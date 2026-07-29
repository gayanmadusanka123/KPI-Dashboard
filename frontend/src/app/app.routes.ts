import { Routes } from '@angular/router';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';

export const routes: Routes = [
    {
    path: '',
    component: DashboardLayout,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/routes').then(
            m => m.DASHBOARD_ROUTES
          )
      },

      {
        path: 'kpi-managment',
        loadChildren: () =>
          import('./features/kpi-managment/routes').then(
            m => m.KPI_OVERVIEW_ROUTES
          )
      },

      {
        path: 'ai-insights',
        loadChildren: () =>
          import('./features/ai-insights/routes').then(
            m => m.AI_INSIGHTS_ROUTES
          )
      },

      {
        path: 'analytics',
        loadChildren: () =>
          import('./features/analytics/routes').then(
            m => m.ANALYTICS_ROUTES
          )
      },

      {
        path: 'reports',
        loadChildren: () =>
          import('./features/reports/routes').then(
            m => m.REPORTS_ROUTES
          )
      },

      {
        path: 'predictions',
        loadChildren: () =>
          import('./features/predictions/routes').then(
            m => m.PREDICTIONS_ROUTES
          )
      },

      {
        path: 'settings',
        loadChildren: () =>
          import('./features/settings/routes').then(
            m => m.SETTINGS_ROUTES
          )
      }
    ]
  }
];
