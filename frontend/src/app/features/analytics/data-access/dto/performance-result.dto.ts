export interface PerformanceResultDto {
    periodId: string;
    periodLabel: string;
    periodStart: string;
    periodEnd: string;

    actualValue: number | null;
    targetValue: number | null;

    performanceScore: number | null;
    variance: number | null;
    variancePercent: number | null;
    periodChangePercent: number | null;

    trendDirection: string | null;
    rollingAverage: number | null;
    cumulativePerformance: number | null;
    status: string | null;
}

export interface PerformanceResultsResponseDto {
    kpiId: string;
    kpiName: string;
    directionOfGood: string;
    periods: PerformanceResultDto[];
}