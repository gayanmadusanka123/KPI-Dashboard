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
    private readonly actualApi: KpiActualApiService
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

  loadKpi(id: string): void {
    this.store.clearError();
    this.store.setLoadingDetails(true);

    this.kpiApi.getById(id).pipe(
      map(mapKpiDtoToKpi),
      tap(kpi => this.store.setSelectedKpi(kpi)),
      catchError(error => {
        this.store.setError(getHttpErrorMessage(error, 'Unable to load the KPI.'));
        return EMPTY;
      }),
      finalize(() => this.store.setLoadingDetails(false))
    ).subscribe();
  }

  createKpi(request: KpiRequestDto): Observable<KpiDetails> {
    this.store.setSaving(true);

    return this.kpiApi.create(request).pipe(
      map(mapKpiDtoToKpi),
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
      periodLabel: period.period
    };

    return this.periodApi.create(periodRequest).pipe(
      concatMap(createdPeriod => {
        const targetRequest: KpiTargetRequestDto = {
          kpiId,
          periodId: createdPeriod.id,
          targetValue: period.targetValue
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
              dataConfidence: period.dataConfidence
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
