import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { KpiDetails } from '../models/kpi.models';
import { KpiFilters } from '../models/kpi-filter.models';
import { KpiState, initialKpiState } from './kpi.state';

@Injectable({ providedIn: 'root' })
export class KpiStore {
  private readonly stateSubject = new BehaviorSubject<KpiState>(initialKpiState);

  readonly state$ = this.stateSubject.asObservable();
  readonly kpis$ = this.select(state => state.kpis);
  readonly selectedKpi$ = this.select(state => state.selectedKpi);
  readonly filters$ = this.select(state => state.filters);
  readonly totalItems$ = this.select(state => state.totalItems);
  readonly totalPages$ = this.select(state => state.totalPages);
  readonly loading$ = this.select(state => state.loading);
  readonly loadingDetails$ = this.select(state => state.loadingDetails);
  readonly saving$ = this.select(state => state.saving);
  readonly deleting$ = this.select(state => state.deleting);
  readonly error$ = this.select(state => state.error);

  get snapshot(): KpiState {
    return this.stateSubject.value;
  }

  setKpis(
    kpis: KpiDetails[],
    totalItems = kpis.length,
    totalPages = 1
  ): void {
    this.patchState({
      kpis,
      totalItems,
      totalPages,
      loading: false,
      error: null
    });
  }

  setSelectedKpi(selectedKpi: KpiDetails | null): void {
    this.patchState({
      selectedKpi,
      loadingDetails: false,
      error: null
    });
  }

  setFilters(filters: Partial<KpiFilters>): void {
    this.patchState({
      filters: {
        ...this.snapshot.filters,
        ...filters
      }
    });
  }

  setLoading(loading: boolean): void {
    this.patchState({ loading });
  }

  setLoadingDetails(loadingDetails: boolean): void {
    this.patchState({ loadingDetails });
  }

  setSaving(saving: boolean): void {
    this.patchState({ saving });
  }

  setDeleting(deleting: boolean): void {
    this.patchState({ deleting });
  }

  replaceKpi(kpi: KpiDetails): void {
    const kpiExists = this.snapshot.kpis.some(item => item.id === kpi.id);
    const kpis = kpiExists
      ? this.snapshot.kpis.map(item => item.id === kpi.id ? kpi : item)
      : [kpi, ...this.snapshot.kpis];

    this.patchState({
      kpis,
      selectedKpi: this.snapshot.selectedKpi?.id === kpi.id
        ? kpi
        : this.snapshot.selectedKpi,
      saving: false,
      error: null
    });
  }

  removeKpi(id: string): void {
    this.patchState({
      kpis: this.snapshot.kpis.filter(kpi => kpi.id !== id),
      selectedKpi: this.snapshot.selectedKpi?.id === id
        ? null
        : this.snapshot.selectedKpi,
      deleting: false,
      error: null
    });
  }

  setError(error: string | null): void {
    this.patchState({
      loading: false,
      loadingDetails: false,
      saving: false,
      deleting: false,
      error
    });
  }

  clearError(): void {
    this.patchState({ error: null });
  }

  clearSelectedKpi(): void {
    this.patchState({ selectedKpi: null });
  }

  private select<T>(selector: (state: KpiState) => T): Observable<T> {
    return this.stateSubject.asObservable().pipe(map(selector));
  }

  private patchState(patch: Partial<KpiState>): void {
    this.stateSubject.next({
      ...this.snapshot,
      ...patch
    });
  }
}
