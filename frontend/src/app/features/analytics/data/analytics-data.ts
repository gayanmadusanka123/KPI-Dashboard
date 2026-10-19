// Analytics feature data. Kept inside the feature so Analytics has no dependency on app-wide shared data.
export const C = {
  bg: '#0B1120',
  sidebar: '#111827',
  card: '#1E293B',
  card2: '#162032',
  border: '#334155',
  primary: '#3B82F6',
  ai: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  pink: '#EC4899',
  text: '#F8FAFC',
  sub: '#94A3B8',
} as const;

export const monthlyData = [
  { month: 'Jan', revenue: 4.2, profit: 1.8, expenses: 2.4 },
  { month: 'Feb', revenue: 3.8, profit: 1.5, expenses: 2.3 },
  { month: 'Mar', revenue: 5.1, profit: 2.3, expenses: 2.8 },
  { month: 'Apr', revenue: 4.7, profit: 2.0, expenses: 2.7 },
  { month: 'May', revenue: 5.8, profit: 2.6, expenses: 3.2 },
  { month: 'Jun', revenue: 6.2, profit: 2.9, expenses: 3.3 },
  { month: 'Jul', revenue: 5.9, profit: 2.7, expenses: 3.2 },
  { month: 'Aug', revenue: 6.8, profit: 3.1, expenses: 3.7 },
  { month: 'Sep', revenue: 7.2, profit: 3.4, expenses: 3.8 },
  { month: 'Oct', revenue: 6.9, profit: 3.2, expenses: 3.7 },
  { month: 'Nov', revenue: 7.8, profit: 3.6, expenses: 4.2 },
  { month: 'Dec', revenue: 8.4, profit: 4.0, expenses: 4.4 },
];

export const deptPerf = [
  { dept: 'Sales', kpi: 92, target: 85 },
  { dept: 'Marketing', kpi: 78, target: 80 },
  { dept: 'Finance', kpi: 95, target: 90 },
  { dept: 'Ops', kpi: 82, target: 88 },
  { dept: 'HR', kpi: 88, target: 85 },
];

export const expenseData = [
  { name: 'Personnel', value: 45 },
  { name: 'Operations', value: 22 },
  { name: 'Marketing', value: 18 },
  { name: 'Technology', value: 10 },
  { name: 'Other', value: 5 },
];

export const growthData = [
  { q: "Q1'23", growth: 12 },
  { q: "Q2'23", growth: 18 },
  { q: "Q3'23", growth: 15 },
  { q: "Q4'23", growth: 22 },
  { q: "Q1'24", growth: 28 },
  { q: "Q2'24", growth: 31 },
  { q: "Q3'24", growth: 29 },
  { q: "Q4'24", growth: 35 },
];

export const heatRows = [
  { team: 'Engineering', scores: [88, 91, 79, 85, 92] },
  { team: 'Design', scores: [82, 77, 90, 84, 78] },
  { team: 'Sales', scores: [95, 88, 92, 97, 93] },
  { team: 'Marketing', scores: [74, 80, 76, 71, 83] },
  { team: 'Finance', scores: [91, 94, 89, 96, 90] },
  { team: 'Operations', scores: [78, 82, 75, 80, 77] },
  { team: 'HR', scores: [85, 79, 88, 83, 86] },
];

export const PIE_COLORS = [C.primary, C.success, C.ai, C.warning, C.danger];

export const analyticsRevenue = monthlyData.map((d) => ({
  ...d,
  expenses: +(d.revenue - d.profit).toFixed(1),
}));

export const channelData = [
  { channel: 'Direct', revenue: 3.1, leads: 420 },
  { channel: 'Organic', revenue: 2.4, leads: 380 },
  { channel: 'Paid', revenue: 1.8, leads: 290 },
  { channel: 'Referral', revenue: 0.7, leads: 110 },
  { channel: 'Partner', revenue: 0.4, leads: 60 },
];
