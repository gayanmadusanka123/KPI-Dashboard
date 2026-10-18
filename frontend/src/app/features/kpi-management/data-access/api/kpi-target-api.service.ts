import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URL } from '../../../../core/http/api-url';
import {
  KpiTargetDto,
  KpiTargetRequestDto
} from '../dto/kpi-target.dto';

@Injectable({ providedIn: 'root' })
export class KpiTargetApiService {
  private readonly endpoint = `${API_URL}/api/kpi-targets`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<KpiTargetDto[]> {
    return this.http.get<KpiTargetDto[]>(this.endpoint);
  }

  getById(id: string): Observable<KpiTargetDto> {
    return this.http.get<KpiTargetDto>(`${this.endpoint}/${id}`);
  }

  create(request: KpiTargetRequestDto): Observable<KpiTargetDto> {
    return this.http.post<KpiTargetDto>(this.endpoint, request);
  }

  update(id: string, request: KpiTargetRequestDto): Observable<KpiTargetDto> {
    return this.http.put<KpiTargetDto>(`${this.endpoint}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
