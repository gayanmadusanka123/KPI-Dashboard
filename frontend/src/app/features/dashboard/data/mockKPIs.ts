export type KPIStatus = "exceeded" | "on-track" | "at-risk" | "off-track";
export type TrendDirection = "improving" | "stable" | "declining";

export interface KPI {
  id: string;
  name: string;
  category: string;
  department: string;
  owner: string;
  unit: string;
  frequency: string;
  currentActual: number;
  currentTarget: number;
  performanceScore: number;
  status: KPIStatus;
  trend: TrendDirection;
  lastUpdated: string;
  dataFreshness: "current" | "due-today" | "overdue";
}

export const mockKPIs: KPI[] = [
  {
    id: "KPI-001",
    name: "Monthly Revenue",
    category: "Financial",
    department: "Sales",
    owner: "Amara Osei",
    unit: "£M",
    frequency: "Monthly",
    currentActual: 4.2,
    currentTarget: 4.0,
    performanceScore: 105,
    status: "exceeded",
    trend: "improving",
    lastUpdated: "2026-10-01",
    dataFreshness: "current",
  },
  {
    id: "KPI-002",
    name: "CSAT Score",
    category: "Customer",
    department: "Support",
    owner: "Priya Nair",
    unit: "%",
    frequency: "Monthly",
    currentActual: 87,
    currentTarget: 90,
    performanceScore: 97,
    status: "at-risk",
    trend: "declining",
    lastUpdated: "2026-10-01",
    dataFreshness: "current",
  },
  {
    id: "KPI-003",
    name: "Headcount",
    category: "People",
    department: "HR",
    owner: "James Whitfield",
    unit: "FTE",
    frequency: "Monthly",
    currentActual: 142,
    currentTarget: 145,
    performanceScore: 98,
    status: "on-track",
    trend: "stable",
    lastUpdated: "2026-09-30",
    dataFreshness: "due-today",
  },
  {
    id: "KPI-004",
    name: "Defect Rate",
    category: "Quality",
    department: "Engineering",
    owner: "Lin Zhao",
    unit: "%",
    frequency: "Weekly",
    currentActual: 3.8,
    currentTarget: 2.5,
    performanceScore: 66,
    status: "off-track",
    trend: "declining",
    lastUpdated: "2026-10-15",
    dataFreshness: "current",
  },
  {
    id: "KPI-005",
    name: "Sales Conversion",
    category: "Sales",
    department: "Sales",
    owner: "Amara Osei",
    unit: "%",
    frequency: "Monthly",
    currentActual: 22.4,
    currentTarget: 20.0,
    performanceScore: 112,
    status: "exceeded",
    trend: "improving",
    lastUpdated: "2026-10-01",
    dataFreshness: "current",
  },
  {
    id: "KPI-006",
    name: "Operational Cost",
    category: "Financial",
    department: "Operations",
    owner: "Fatima Al-Rashid",
    unit: "£K",
    frequency: "Monthly",
    currentActual: 182,
    currentTarget: 175,
    performanceScore: 96,
    status: "at-risk",
    trend: "stable",
    lastUpdated: "2026-10-01",
    dataFreshness: "current",
  },
  {
    id: "KPI-007",
    name: "Website Traffic",
    category: "Marketing",
    department: "Marketing",
    owner: "Tom Bridges",
    unit: "K visits",
    frequency: "Weekly",
    currentActual: 94.2,
    currentTarget: 100.0,
    performanceScore: 94,
    status: "on-track",
    trend: "improving",
    lastUpdated: "2026-10-20",
    dataFreshness: "current",
  },
  {
    id: "KPI-008",
    name: "On-Time Delivery",
    category: "Operations",
    department: "Operations",
    owner: "Fatima Al-Rashid",
    unit: "%",
    frequency: "Monthly",
    currentActual: 78,
    currentTarget: 95,
    performanceScore: 82,
    status: "off-track",
    trend: "declining",
    lastUpdated: "2026-09-15",
    dataFreshness: "overdue",
  },
];

export const statusDistribution = [
  { name: "Exceeded", value: 2, color: "#2563EB" },
  { name: "On Track", value: 2, color: "#16A34A" },
  { name: "At Risk", value: 2, color: "#D97706" },
  { name: "Off Track", value: 2, color: "#DC2626" },
];
