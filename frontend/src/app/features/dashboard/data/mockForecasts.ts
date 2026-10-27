export interface ForecastRow {
  kpiId: string;
  kpiName: string;
  currentValue: number;
  unit: string;
  nextPeriodForecast: number;
  forecastChangePct: number;
  confidence: "High" | "Medium" | "Low";
  modelTier: string;
}

export const mockForecasts: ForecastRow[] = [
  { kpiId: "KPI-001", kpiName: "Monthly Revenue", currentValue: 4.2, unit: "£M", nextPeriodForecast: 4.51, forecastChangePct: 7.4, confidence: "High", modelTier: "Facebook Prophet" },
  { kpiId: "KPI-002", kpiName: "CSAT Score", currentValue: 87, unit: "%", nextPeriodForecast: 85.2, forecastChangePct: -2.1, confidence: "Medium", modelTier: "SARIMA" },
  { kpiId: "KPI-003", kpiName: "Headcount", currentValue: 142, unit: "FTE", nextPeriodForecast: 144, forecastChangePct: 1.4, confidence: "High", modelTier: "Linear Regression" },
  { kpiId: "KPI-004", kpiName: "Defect Rate", currentValue: 3.8, unit: "%", nextPeriodForecast: 4.1, forecastChangePct: 7.9, confidence: "Medium", modelTier: "SARIMA" },
  { kpiId: "KPI-005", kpiName: "Sales Conversion", currentValue: 22.4, unit: "%", nextPeriodForecast: 23.1, forecastChangePct: 3.1, confidence: "High", modelTier: "Facebook Prophet" },
  { kpiId: "KPI-006", kpiName: "Operational Cost", currentValue: 182, unit: "£K", nextPeriodForecast: 186, forecastChangePct: 2.2, confidence: "Medium", modelTier: "Exp. Smoothing" },
  { kpiId: "KPI-007", kpiName: "Website Traffic", currentValue: 94.2, unit: "K", nextPeriodForecast: 102.5, forecastChangePct: 8.8, confidence: "High", modelTier: "Facebook Prophet" },
  { kpiId: "KPI-008", kpiName: "On-Time Delivery", currentValue: 78, unit: "%", nextPeriodForecast: 74.3, forecastChangePct: -4.7, confidence: "Low", modelTier: "Linear Regression" },
];

export const atRiskKPIs = [
  { id: "KPI-004", name: "Defect Rate", shortfallPct: 64, probability: 0.91, urgency: "Critical", periods: 1 },
  { id: "KPI-008", name: "On-Time Delivery", shortfallPct: 22, probability: 0.87, urgency: "High", periods: 2 },
  { id: "KPI-002", name: "CSAT Score", shortfallPct: 8, probability: 0.74, urgency: "Medium", periods: 3 },
  { id: "KPI-006", name: "Operational Cost", shortfallPct: 6, probability: 0.62, urgency: "Medium", periods: 2 },
];