
import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DashboardLayout, DashboardWidget } from '../models/dashboard-layout.models';

const DEFAULT_WIDGETS: DashboardWidget[] = [
  {
    id: 'kpi-scorecard',
    title: 'KPI Performance Scorecard',
    description: 'Overall KPI performance summary.',
    x: 2, y: 0, cols: 2, rows: 2,
  },
  {
    id: 'performance-distribution',
    title: 'Performance Distribution',
    description: 'KPI status distribution.',
    x: 0, y: 0, cols: 1, rows: 1,
  },
  {
    id: 'target-achievement',
    title: 'Target Achievement',
    description: 'Progress against targets.',
    x: 1, y: 0, cols: 1, rows: 1,
  },
  {
    id: 'top-bottom-performers',
    title: 'Top & Bottom Performers',
    description: 'Highest and lowest performing KPIs.',
    x: 0, y: 1, cols: 2, rows: 2,
  },
  {
    id: 'forecast-overview',
    title: 'Forecast Overview',
    description: 'Projected KPI performance.',
    x: 0, y: 3, cols: 2, rows: 2,
  },
  {
    id: 'at-risk-kpis',
    title: 'At-Risk KPI Predictor',
    description: 'KPIs that may miss their targets.',
    x: 2, y: 2, cols: 2, rows: 1,
  },
  {
    id: 'ai-insights',
    title: 'AI Insight Feed',
    description: 'Insights and recommendations.',
    x: 3, y: 3, cols: 1, rows: 2,
  },
  {
    id: 'data-freshness',
    title: 'Data Freshness',
    description: 'Recent KPI data updates.',
    x: 2, y: 3, cols: 1, rows: 2,
  },
];

@Injectable({ providedIn: 'root' })
export class DashboardLayoutService {
  private readonly platformId = inject(PLATFORM_ID);

  // Temporary key until authentication supplies the actual user ID.
  private readonly storageKey = 'kpi-dashboard-layout-demo-user';

  private clone(widgets: DashboardWidget[]): DashboardWidget[] {
    return widgets.map(widget => ({ ...widget }));
  }

  getDefaultLayout(): DashboardLayout {
    return { widgets: this.clone(DEFAULT_WIDGETS) };
  }

  loadLayout(): DashboardLayout {
    if (!isPlatformBrowser(this.platformId)) {
      return this.getDefaultLayout();
    }

    try {
      const raw = localStorage.getItem(this.storageKey);

      if (raw) {
        const parsed: unknown = JSON.parse(raw);

        if (
          typeof parsed === 'object' &&
          parsed !== null &&
          'widgets' in parsed &&
          Array.isArray(parsed.widgets)
        ) {
          return parsed as DashboardLayout;
        }
      }
    } catch {
      // Invalid or inaccessible storage: use the default layout.
    }

    return this.getDefaultLayout();
  }

  saveLayout(layout: DashboardLayout): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(layout),
      );
    } catch {
      // Storage may be unavailable or full.
    }
  }

  resetLayout(): DashboardLayout {
    const layout = this.getDefaultLayout();
    this.saveLayout(layout);
    return layout;
  }
}