import { EMPTY, forkJoin, of, throwError, filter } from 'rxjs';
import { catchError, finalize, map, switchMap, take, timeout } from 'rxjs';

import { KpiFacade } from '../../../kpi-management/state/kpi.facade';
import { PerformanceApiService } from '../../data-access/api/performance-api.service';

import { KpiDetails } from '../../../kpi-management/models/kpi.models';

import {
  KpiPerformance,
  KpiPerformanceSummary,
  OverallPerformanceSummary,
  DepartmentPerformance
} from '../../models/performance-result.model';

import { ChangeDetectionStrategy, Component, OnInit, signal, inject } from '@angular/core';
import { AnalyticsTabs, AnalyticsTabId } from '../../components/analytics-tabs/analytics-tabs';
import { DistributionTab } from '../../components/distribution-tab/distribution-tab';
import { Icon } from '../../components/icon/icon';
import { PerformanceTab } from '../../components/performance-tab/performance-tab';
import { RevenueTab } from '../../components/revenue-tab/revenue-tab';
import { AnalyticsSectionHeader } from '../../components/section-header/section-header';
import { TrendsTab } from '../../components/trends-tab/trends-tab';
import { C } from '../../data/analytics-data';

@Component({
  selector: 'app-analytics',
  imports: [AnalyticsSectionHeader, AnalyticsTabs, RevenueTab, PerformanceTab, TrendsTab, DistributionTab, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './analytics.html',
  styleUrl: './analytics.css',
})


export class Analytics implements OnInit {
  readonly C = C;
  readonly tab = signal<AnalyticsTabId>('revenue');

  private readonly kpiFacade = inject(KpiFacade);
  private readonly performanceApi = inject(PerformanceApiService);

  readonly performanceResults = signal<KpiPerformance[]>([]);
  readonly performanceSummaries = signal<KpiPerformanceSummary[]>([]);
  readonly overallSummary = signal<OverallPerformanceSummary | null>(null);
  readonly departmentPerformance = signal<DepartmentPerformance[]>([]);

  readonly performanceLoading = signal(false);
  readonly performanceError = signal<string | null>(null);

  ngOnInit(): void {
    this.loadOverallPerformance();
  }

  setTab(tab: AnalyticsTabId): void {
    this.tab.set(tab);
  }

  private loadOverallPerformance(): void {
    this.performanceLoading.set(true);
    this.performanceError.set(null);

    // Load KPIs through the existing shared facade.
    this.kpiFacade.loadKpis();

    this.kpiFacade.state$.pipe(
      // Wait until the KPI API request finishes.
      filter(state => !state.loading),
      take(1),
      timeout(16000),

      switchMap(state => {
        if (state.error) {
          return throwError(() => new Error(state.error!));
        }

        if (state.kpis.length === 0) {
          this.processOverallPerformance([]);
          return of([]);
        }

        // Request performance results for every KPI.
        const requests = state.kpis.map(kpi =>
          this.performanceApi.getByKpiId(kpi.id).pipe(
            timeout(15000),
            map(performance => ({
              kpi,
              performance: performance as KpiPerformance
            })),
            catchError(() => of({
              kpi,
              performance: null
            }))
          )
        );

        return forkJoin(requests);
      }),

      finalize(() => this.performanceLoading.set(false))

    ).subscribe({
      next: results => {
        this.processOverallPerformance(results);
      },

      error: error => {
        this.performanceError.set(
          error.message || 'Unable to load overall performance data.'
        );
      }
    });
  }

  private processOverallPerformance(
    results: {
      kpi: KpiDetails;
      performance: KpiPerformance | null;
    }[]
  ): void {

    // We will add the aggregation logic here.
  }
}
