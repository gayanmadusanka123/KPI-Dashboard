import { Injectable } from '@angular/core';
import { EMPTY, Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, concatMap, finalize, map, tap, timeout } from 'rxjs/operators';

import { getHttpErrorMessage } from '../../../core/http/http-error-handler';
import { KpiApiService } from '../data-access/api/kpi-api.service';
import { KpiActualApiService } from '../data-access/api/kpi-actual-api.service';
import { KpiPeriodApiService } from '../data-access/api/kpi-period-api.service';
import { KpiTargetApiService } from '../data-access/api/kpi-target-api.service';
import { mapKpiDtoToKpi } from '../data-access/mappers/kpi.mapper';
import { KpiDetails, ReportingPeriod } from '../models/kpi.models';
import { KpiFilters } from '../models/kpi-filter.models';
import { KpiRequestDto } from '../data-access/dto/kpi.dto';
import { KpiPeriodRequestDto } from '../data-access/dto/kpi-period.dto';
import { KpiTargetRequestDto } from '../data-access/dto/kpi-target.dto';
import { KpiActualRequestDto } from '../data-access/dto/kpi-actual.dto';
import { KpiHistoryApiService } from '../data-access/api/kpi-history-api.service';
import { KpiActualDto } from '../data-access/dto/kpi-actual.dto';
import { KpiPeriodDto } from '../data-access/dto/kpi-period.dto';
import { KpiTargetDto } from '../data-access/dto/kpi-target.dto';
import { KpiStore } from './kpi.store';

@Injectable({ providedIn: 'root' })
export class KpiFacade {
  readonly state$: KpiStore['state$'];
  readonly kpis$: KpiStore['kpis$'];
  readonly selectedKpi$: KpiStore['selectedKpi$'];
  readonly filters$: KpiStore['filters$'];
  readonly loading$: KpiStore['loading$'];
  readonly loadingDetails$: KpiStore['loadingDetails$'];
  readonly saving$: KpiStore['saving$'];
  readonly deleting$: KpiStore['deleting$'];
  readonly error$: KpiStore['error$'];

  constructor(
    private readonly store: KpiStore,
    private readonly kpiApi: KpiApiService,
    private readonly periodApi: KpiPeriodApiService,
    private readonly targetApi: KpiTargetApiService,
    private readonly actualApi: KpiActualApiService,
    private readonly historyApi: KpiHistoryApiService
  ) {
    this.state$ = store.state$;
    this.kpis$ = store.kpis$;
    this.selectedKpi$ = store.selectedKpi$;
    this.filters$ = store.filters$;
    this.loading$ = store.loading$;
    this.loadingDetails$ = store.loadingDetails$;
    this.saving$ = store.saving$;
    this.deleting$ = store.deleting$;
    this.error$ = store.error$;
  }
  // Load all KPIs
  loadKpis(): void {
    this.store.clearError();
    this.store.setLoading(true);

    this.kpiApi.getAll().pipe(
      timeout(15000),
      map(kpis => kpis.map(mapKpiDtoToKpi)),
      tap(kpis => this.store.setKpis(kpis)),
      catchError(error => {
        this.store.setError(
          getHttpErrorMessage(
            error,
            'Unable to load KPIs. The backend did not respond within 15 seconds.'
          )
        );
        return EMPTY;
      }),
      finalize(() => this.store.setLoading(false))
    ).subscribe();
  }
// Load a specific KPI by ID
  loadKpi(id: string): void {
    this.store.clearError();
    this.store.clearSelectedKpi();
    this.store.setLoadingDetails(true);

    this.kpiApi.getById(id).pipe(
      timeout(15000),
      concatMap(dto => forkJoin({
        kpi: of(mapKpiDtoToKpi(dto)),
        periods: this.periodApi.getAll(),
        targets: this.targetApi.getAll(),
        actuals: this.actualApi.getAll()
      })),
      map(data => ({
        ...data.kpi,
        reportingHistory: buildReportingHistory(
          data.periods.filter(period => period.kpiId === id),
          data.targets.filter(target => target.kpiId === id),
          data.actuals.filter(actual => actual.kpiId === id),
          data.kpi.directionOfGood
        )
      })),
      tap(kpi => this.store.setSelectedKpi(kpi)),
      catchError(error => {
        this.store.setError(
          getHttpErrorMessage(
            error,
            'Unable to load the KPI. The backend did not respond within 15 seconds.'
          )
        );
        return EMPTY;
      }),
      finalize(() => this.store.setLoadingDetails(false))
    ).subscribe();
  }

  // Create a new KPI
  createKpi(request: KpiRequestDto): Observable<KpiDetails> {
    // Set the saving state to true before making the API call
    this.store.setSaving(true);

    // Make the API call to create the KPI and handle the response
    return this.kpiApi.create(request).pipe(
      map(mapKpiDtoToKpi),
      
      //update the local state with the newly created KPI
      tap(kpi => this.store.replaceKpi(kpi)),
      catchError(error => {
        this.store.setError(getHttpErrorMessage(error, 'Unable to create the KPI.'));
        return throwError(() => error);
      }),
      finalize(() => this.store.setSaving(false))
    );
  }

  updateKpi(id: string, request: KpiRequestDto): Observable<KpiDetails> {
    this.store.setSaving(true);

    return this.kpiApi.update(id, request).pipe(
      map(mapKpiDtoToKpi),
      tap(kpi => this.store.replaceKpi(kpi)),
      catchError(error => {
        this.store.setError(getHttpErrorMessage(error, 'Unable to update the KPI.'));
        return throwError(() => error);
      }),
      finalize(() => this.store.setSaving(false))
    );
  }

  deleteKpi(id: string): Observable<void> {
    this.store.setDeleting(true);

    return this.kpiApi.delete(id).pipe(
      tap(() => this.store.removeKpi(id)),
      catchError(error => {
        this.store.setError(getHttpErrorMessage(error, 'Unable to delete the KPI.'));
        return throwError(() => error);
      }),
      finalize(() => this.store.setDeleting(false))
    );
  }

  addReportingPeriod(
    kpiId: string,
    period: ReportingPeriod
  ): Observable<void> {
    this.store.setSaving(true);

    const dates = getPeriodDates(period);
    const periodRequest: KpiPeriodRequestDto = {
      kpiId,
      periodStart: dates.start,
      periodEnd: dates.end,
      periodLabel: period.period,
      periodSequence: period.periodSequence
    };

    return this.periodApi.create(periodRequest).pipe(
      concatMap(createdPeriod => {
        const targetRequest: KpiTargetRequestDto = {
          kpiId,
          periodId: createdPeriod.id,
          targetValue: period.targetValue,
          editReason: period.editReason
        };

        return this.targetApi.create(targetRequest).pipe(
          concatMap(() => {
            if (period.actualValue === null) {
              return of(undefined);
            }

            const actualRequest: KpiActualRequestDto = {
              kpiId,
              periodId: createdPeriod.id,
              actualValue: period.actualValue,
              dataConfidence: period.dataConfidence,
              editReason: period.editReason
            };

            return this.actualApi.create(actualRequest).pipe(map(() => undefined));
          })
        );
      }),
      tap(() => this.loadKpi(kpiId)),
      catchError(error => {
        this.store.setError(
          getHttpErrorMessage(error, 'Unable to save the reporting period.')
        );
        return throwError(() => error);
      }),
      finalize(() => this.store.setSaving(false))
    );
  }

  updateReportingPeriod(
    kpiId: string,
    period: ReportingPeriod
  ): Observable<void> {
    if (!period.periodId) {
      return throwError(() => new Error('The reporting period identifier is missing.'));
    }

    this.store.setSaving(true);
    const dates = getPeriodDates(period);

    return this.loadReportingData(kpiId).pipe(
      concatMap(data => {
        const target = data.targets.find(item => item.periodId === period.periodId);
        const actual = data.actuals.find(item => item.periodId === period.periodId);

        if (!target) {
          return throwError(() => new Error('The target record for this period was not found.'));
        }

        return forkJoin({
          period: this.periodApi.update(period.periodId!, {
            kpiId,
            periodStart: dates.start,
            periodEnd: dates.end,
            periodLabel: period.period,
            periodSequence: period.periodSequence
          }),
          target: this.targetApi.update(target.id, {
            kpiId,
            periodId: period.periodId!,
            targetValue: period.targetValue,
            editReason: period.editReason
          })
        }).pipe(
          concatMap(() => {
            if (period.actualValue === null) {
              return actual ? this.actualApi.delete(actual.id) : of(undefined);
            }

            const actualRequest: KpiActualRequestDto = {
              kpiId,
              periodId: period.periodId!,
              actualValue: period.actualValue,
              dataConfidence: period.dataConfidence,
              editReason: period.editReason
            };

            return actual
              ? this.actualApi.update(actual.id, actualRequest).pipe(map(() => undefined))
              : this.actualApi.create(actualRequest).pipe(map(() => undefined));
          })
        );
      }),
      tap(() => this.loadKpi(kpiId)),
      map(() => undefined),
      catchError(error => {
        this.store.setError(
          getHttpErrorMessage(error, 'Unable to update the reporting period.')
        );
        return throwError(() => error);
      }),
      finalize(() => this.store.setSaving(false))
    );
  }

  loadReportingData(kpiId: string): Observable<{
    periods: import('../data-access/dto/kpi-period.dto').KpiPeriodDto[];
    targets: import('../data-access/dto/kpi-target.dto').KpiTargetDto[];
    actuals: import('../data-access/dto/kpi-actual.dto').KpiActualDto[];
  }> {
    return forkJoin({
      periods: this.periodApi.getAll(),
      targets: this.targetApi.getAll(),
      actuals: this.actualApi.getAll()
    }).pipe(
      map(data => ({
        periods: data.periods.filter(period => period.kpiId === kpiId),
        targets: data.targets.filter(target => target.kpiId === kpiId),
        actuals: data.actuals.filter(actual => actual.kpiId === kpiId)
      }))
    );
  }

  loadPeriodHistory(kpiId: string, periodId: string): Observable<{
    targetHistory: import('../data-access/dto/kpi-history.dto').KpiTargetHistoryDto[];
    actualHistory: import('../data-access/dto/kpi-history.dto').KpiActualHistoryDto[];
  }> {
    return this.loadReportingData(kpiId).pipe(
      concatMap(data => {
        const target = data.targets.find(item => item.periodId === periodId);
        const actual = data.actuals.find(item => item.periodId === periodId);
        return forkJoin({
          targetHistory: target ? this.historyApi.getTargetHistory(target.id) : of([]),
          actualHistory: actual ? this.historyApi.getActualHistory(actual.id) : of([])
        });
      })
    );
  }

  updateFilters(filters: Partial<KpiFilters>): void {
    this.store.setFilters(filters);
  }

  clearSelectedKpi(): void {
    this.store.clearSelectedKpi();
  }
}

function getPeriodDates(period: ReportingPeriod): { start: string; end: string } {
  if (period.periodStart && period.periodEnd) {
    return {
      start: period.periodStart,
      end: period.periodEnd
    };
  }

  function buildReportingHistory(
    periods: KpiPeriodDto[],
    targets: KpiTargetDto[],
    actuals: KpiActualDto[],
    directionOfGood: KpiDetails['directionOfGood']
  ): ReportingPeriod[] {
    return periods
      .map(period => {
        const target = targets.find(item => item.periodId === period.id);
        const actual = actuals.find(item => item.periodId === period.id);
        const targetValue = target?.targetValue ?? 0;
        const actualValue = actual?.actualValue ?? null;
        const performanceScore = calculateScore(targetValue, actualValue, directionOfGood);
        const variance = actualValue === null ? null : actualValue - targetValue;

        return {
          id: period.id,
          kpiId: period.kpiId,
          periodId: period.id,
          period: period.periodLabel ?? `${period.periodStart} - ${period.periodEnd}`,
          periodStart: period.periodStart,
          periodEnd: period.periodEnd,
          periodSequence: period.periodSequence ?? undefined,
          targetValue,
          actualValue,
          performanceScore,
          variance,
          variancePct: actualValue === null || targetValue === 0
            ? null
            : Number(((variance! / targetValue) * 100).toFixed(2)),
          status: getPerformanceStatus(performanceScore),
          notes: '',
          dataConfidence: actual?.dataConfidence ?? 'Medium',
          enteredAt: actual?.createdAt ?? target?.createdAt ?? period.createdAt,
          modifiedAt: latestTimestamp(
            actual?.updatedAt,
            target?.updatedAt,
            period.createdAt
          )
        };
      })
      .sort((a, b) => b.periodStart!.localeCompare(a.periodStart!));
  }

  function calculateScore(
    target: number,
    actual: number | null,
    direction: KpiDetails['directionOfGood']
  ): number | null {
    if (actual === null || target === 0) return null;
    const score = direction === 'Lower is Better'
      ? actual === 0 ? 100 : target / actual * 100
      : actual / target * 100;
    return Number(score.toFixed(2));
  }

  function getPerformanceStatus(score: number | null): ReportingPeriod['status'] {
    if (score === null) return 'Awaiting actual';
    if (score > 100) return 'Exceeded';
    if (score >= 95) return 'On Track';
    if (score >= 85) return 'At Risk';
    return 'Off Track';
  }

  const match = /^(\d{4})-(\d{2})$/.exec(period.period);
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
    return {
      start: `${match[1]}-${match[2]}-01`,
      end: `${match[1]}-${match[2]}-${String(lastDay).padStart(2, '0')}`
    };
  }

  const today = new Date().toISOString().slice(0, 10);
  return { start: today, end: today };
}

function buildReportingHistory(
  periods: KpiPeriodDto[],
  targets: KpiTargetDto[],
  actuals: KpiActualDto[],
  directionOfGood: KpiDetails['directionOfGood']
): ReportingPeriod[] {
  return periods
    .map(period => {
      const target = targets.find(item => item.periodId === period.id);
      const actual = actuals.find(item => item.periodId === period.id);
      const targetValue = target?.targetValue ?? 0;
      const actualValue = actual?.actualValue ?? null;
      const performanceScore = calculateScore(targetValue, actualValue, directionOfGood);
      const variance = actualValue === null ? null : actualValue - targetValue;

      return {
        id: period.id,
        kpiId: period.kpiId,
        periodId: period.id,
        period: period.periodLabel ?? `${period.periodStart} - ${period.periodEnd}`,
        periodStart: period.periodStart,
        periodEnd: period.periodEnd,
        periodSequence: period.periodSequence ?? undefined,
        targetValue,
        actualValue,
        performanceScore,
        variance,
        variancePct: actualValue === null || targetValue === 0
          ? null
          : Number(((variance! / targetValue) * 100).toFixed(2)),
        status: getPerformanceStatus(performanceScore),
        notes: '',
        dataConfidence: actual?.dataConfidence ?? 'Medium',
        enteredAt: actual?.createdAt ?? target?.createdAt ?? period.createdAt,
        modifiedAt: latestTimestamp(
          actual?.updatedAt,
          target?.updatedAt,
          period.createdAt
        )
      };
    })
    .sort((a, b) => b.periodStart!.localeCompare(a.periodStart!));
}

function calculateScore(
  target: number,
  actual: number | null,
  direction: KpiDetails['directionOfGood']
): number | null {
  if (actual === null || target === 0) return null;
  const score = direction === 'Lower is Better'
    ? actual === 0 ? 100 : target / actual * 100
    : actual / target * 100;
  return Number(score.toFixed(2));
}

function getPerformanceStatus(score: number | null): ReportingPeriod['status'] {
  if (score === null) return 'Awaiting actual';
  if (score > 100) return 'Exceeded';
  if (score >= 95) return 'On Track';
  if (score >= 85) return 'At Risk';
  return 'Off Track';
}

function latestTimestamp(...values: (string | null | undefined)[]): string {
  return values
    .filter((value): value is string => Boolean(value))
    .sort((left, right) => right.localeCompare(left))[0] ?? new Date().toISOString();
}
