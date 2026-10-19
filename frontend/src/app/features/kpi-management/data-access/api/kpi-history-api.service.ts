import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../../../core/http/api-url';
import { KpiActualHistoryDto, KpiTargetHistoryDto } from '../dto/kpi-history.dto';

@Injectable({ providedIn: 'root' })
export class KpiHistoryApiService {
  private readonly targetEndpoint = `${API_URL}/api/kpi-targets`;
  private readonly actualEndpoint = `${API_URL}/api/kpi-actuals`;

  constructor(private readonly http: HttpClient) {}

  getTargetHistory(targetId: string): Observable<KpiTargetHistoryDto[]> {
    return this.http.get<KpiTargetHistoryDto[]>(`${this.targetEndpoint}/${targetId}/history`);
  }

  getActualHistory(actualId: string): Observable<KpiActualHistoryDto[]> {
    return this.http.get<KpiActualHistoryDto[]>(`${this.actualEndpoint}/${actualId}/history`);
  }
}
