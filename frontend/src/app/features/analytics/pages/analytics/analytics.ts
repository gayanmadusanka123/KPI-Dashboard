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

    // Keep only KPIs that successfully returned performance data.
    const validResults = results.filter(
      (item): item is {
        kpi: KpiDetails;
        performance: KpiPerformance;
      } => item.performance !== null
    );

    this.performanceResults.set(
      validResults.map(item => item.performance)
    );

    // Find the latest calculated result for each KPI.
    const summaries: KpiPerformanceSummary[] = validResults.map(
      ({ kpi, performance }) => {

        const latestPeriod = [...performance.periods]
          .filter(period => period.performanceScore !== null)
          .sort(
            (a, b) =>
              new Date(b.periodEnd).getTime() -
              new Date(a.periodEnd).getTime()
          )[0];

        return {
          kpiId: kpi.id,
          kpiName: kpi.name,
          department: kpi.dept || 'Unassigned',
          latestScore: latestPeriod?.performanceScore ?? null,
          latestStatus: latestPeriod?.status ?? null,
          latestTrend: latestPeriod?.trendDirection ?? null
        };
      }
    );

    this.performanceSummaries.set(summaries);

    // KPIs with an available calculated score.
    const availableResults = summaries.filter(
      item => item.latestScore !== null
    );

    const scores = availableResults.map(
      item => item.latestScore!
    );

    const averagePerformance = scores.length > 0
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length
      : null;

    const normalizeStatus = (status: string | null): string =>
      status?.trim().toLowerCase().replace(/[_-]/g, ' ') ?? '';

    // Calculate overall summary.
    this.overallSummary.set({
      totalKpis: results.length,
      kpisWithResults: availableResults.length,
      averagePerformance,

      exceededCount: availableResults.filter(
        item => normalizeStatus(item.latestStatus) === 'exceeded'
      ).length,

      onTrackCount: availableResults.filter(
        item => normalizeStatus(item.latestStatus) === 'on track'
      ).length,

      atRiskCount: availableResults.filter(
        item => normalizeStatus(item.latestStatus) === 'at risk'
      ).length,

      offTrackCount: availableResults.filter(
        item => normalizeStatus(item.latestStatus) === 'off track'
      ).length
    });

    // Group KPI scores by department.
    const departmentGroups = new Map<string, number[]>();

    availableResults.forEach(item => {
      const department = item.department;
      const departmentScores = departmentGroups.get(department) ?? [];

      departmentScores.push(item.latestScore!);
      departmentGroups.set(department, departmentScores);
    });

    const departments: DepartmentPerformance[] = Array.from(
      departmentGroups.entries()
    ).map(([department, departmentScores]) => ({
      department,
      averageScore:
        departmentScores.reduce((sum, score) => sum + score, 0) /
        departmentScores.length,
      kpiCount: departmentScores.length
    }));

    this.departmentPerformance.set(departments);

    console.log('Overall Performance:', this.overallSummary());
    console.log('KPI Summaries:', this.performanceSummaries());
    console.log('Department Performance:', this.departmentPerformance());
  }

}
