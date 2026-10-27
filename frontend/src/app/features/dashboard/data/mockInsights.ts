export type InsightType = "Anomaly" | "Trend" | "Forecast" | "Benchmark";

export interface Insight {
  id: string;
  kpiId: string;
  kpiName: string;
  type: InsightType;
  text: string;
  relevanceScore: number;
  createdAt: string;
  actioned: boolean;
}

export interface Anomaly {
  id: string;
  kpiId: string;
  kpiName: string;
  period: string;
  actualValue: number;
  expectedRange: [number, number];
  unit: string;
  severity: "High" | "Medium" | "Low";
  explanation: string;
  acknowledged: boolean;
}

export interface ActionItem {
  id: string;
  title: string;
  kpiId: string;
  kpiName: string;
  owner: string;
  dueDate: string;
  status: "todo" | "in-progress" | "done";
  source: "manual" | "ai";
}

export const mockInsights: Insight[] = [
  { id: "I-001", kpiId: "KPI-004", kpiName: "Defect Rate", type: "Anomaly", text: "Defect Rate spiked to 3.8% in Oct — 52% above the expected upper bound of 2.5%. This coincides with a new deployment cycle and may warrant an engineering review.", relevanceScore: 0.97, createdAt: "2026-10-21", actioned: false },
  { id: "I-002", kpiId: "KPI-001", kpiName: "Monthly Revenue", type: "Trend", text: "Monthly Revenue has improved for 4 consecutive periods. The current growth trajectory of +7.4% aligns with the Favourable economic scenario preset.", relevanceScore: 0.89, createdAt: "2026-10-20", actioned: false },
  { id: "I-003", kpiId: "KPI-008", kpiName: "On-Time Delivery", type: "Forecast", text: "On-Time Delivery is forecast to fall to 74.3% next month — 21 percentage points below the 95% target. Immediate intervention is recommended to prevent further deterioration.", relevanceScore: 0.94, createdAt: "2026-10-19", actioned: false },
  { id: "I-004", kpiId: "KPI-002", kpiName: "CSAT Score", type: "Benchmark", text: "CSAT Score of 87% is 6 points below the industry benchmark of 93%. The gap has widened by 2 points over the last quarter.", relevanceScore: 0.81, createdAt: "2026-10-18", actioned: false },
  { id: "I-005", kpiId: "KPI-005", kpiName: "Sales Conversion", type: "Trend", text: "Sales Conversion at 22.4% exceeds target by 12%. Strong positive correlation with Website Traffic (r=0.84) suggests continued outperformance if traffic growth holds.", relevanceScore: 0.76, createdAt: "2026-10-17", actioned: true },
];

export const mockAnomalies: Anomaly[] = [
  { id: "A-001", kpiId: "KPI-004", kpiName: "Defect Rate", period: "Oct 2026", actualValue: 3.8, expectedRange: [1.8, 2.5], unit: "%", severity: "High", explanation: "Value 52% above expected upper bound. Likely cause: new deployment on 14 Oct introduced regression in error handling.", acknowledged: false },
  { id: "A-002", kpiId: "KPI-008", kpiName: "On-Time Delivery", period: "Sep 2026", actualValue: 78, expectedRange: [88, 97], unit: "%", severity: "High", explanation: "Sharp drop of 14pp vs prior period. Warehouse system outage from 22–26 Sep affected dispatch scheduling.", acknowledged: false },
  { id: "A-003", kpiId: "KPI-007", kpiName: "Website Traffic", period: "Oct W3 2026", actualValue: 127.4, expectedRange: [88, 108], unit: "K", severity: "Low", explanation: "Positive spike: 18% above upper bound. Likely driven by viral social media post on 17 Oct.", acknowledged: true },
];

export const mockActionItems: ActionItem[] = [
  { id: "AC-001", title: "Schedule post-deployment defect review", kpiId: "KPI-004", kpiName: "Defect Rate", owner: "Lin Zhao", dueDate: "2026-10-28", status: "todo", source: "ai" },
  { id: "AC-002", title: "Investigate warehouse dispatch system logs", kpiId: "KPI-008", kpiName: "On-Time Delivery", owner: "Fatima Al-Rashid", dueDate: "2026-10-25", status: "in-progress", source: "ai" },
  { id: "AC-003", title: "Launch CSAT improvement initiative Q4", kpiId: "KPI-002", kpiName: "CSAT Score", owner: "Priya Nair", dueDate: "2026-11-01", status: "todo", source: "manual" },
  { id: "AC-004", title: "Update Oct actuals for all Sales KPIs", kpiId: "KPI-001", kpiName: "Monthly Revenue", owner: "Amara Osei", dueDate: "2026-10-24", status: "in-progress", source: "manual" },
  { id: "AC-005", title: "Review operational cost budget variance", kpiId: "KPI-006", kpiName: "Operational Cost", owner: "Fatima Al-Rashid", dueDate: "2026-10-22", status: "done", source: "ai" },
];