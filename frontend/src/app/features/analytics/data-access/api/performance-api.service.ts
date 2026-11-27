import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { API_URL } from "../../../../core/http/api-url";

import { PerformanceResultsResponseDto } from "../dto/performance-result.dto";

@Injectable({
    providedIn: 'root'
})

export class PerformanceApiService {

    private readonly endpoint = `${API_URL}/api/performance/results`;

    constructor(private readonly http: HttpClient) { }

    getByKpiId(kpiId: string): Observable<PerformanceResultsResponseDto> {
        return this.http.get<PerformanceResultsResponseDto>(
            `${this.endpoint}/${kpiId}`
        );
    }
}