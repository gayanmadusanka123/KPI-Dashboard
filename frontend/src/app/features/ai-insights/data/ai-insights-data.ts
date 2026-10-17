export const C = {
  bg: '#0B1120',
  card: '#1E293B',
  border: '#334155',
  primary: '#3B82F6',
  ai: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  text: '#F8FAFC',
  sub: '#94A3B8',
} as const;

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'ai';

export const models = [
  { name: 'Revenue Predictor', version: 'v4.2', accuracy: 93, status: 'active', color: C.primary, trained: '6h ago' },
  { name: 'Anomaly Detector', version: 'v2.8', accuracy: 89, status: 'active', color: C.ai, trained: '2h ago' },
  { name: 'Churn Classifier', version: 'v3.1', accuracy: 87, status: 'active', color: C.success, trained: '1d ago' },
];

export const insights = [
  { type: 'opportunity', icon: 'TrendingUp' as const, color: C.success, title: 'APAC Revenue Surge Detected', body: 'APAC region sales pipeline has grown 28% MoM. Recommend deploying 2 additional enterprise AEs to capitalize on identified $4.2M in unworked leads before Q1 close.', confidence: 94, impact: 'High', time: '2 min ago' },
  { type: 'risk', icon: 'AlertTriangle' as const, color: C.warning, title: 'Marketing CAC Deterioration', body: 'Customer acquisition cost in paid channels up 12% over 6 weeks. Current trend projects CPL will breach $600 threshold by Jan 15. Recommend budget reallocation.', confidence: 87, impact: 'Medium', time: '18 min ago' },
  { type: 'anomaly', icon: 'Zap' as const, color: C.ai, title: 'Unusual Expense Pattern — Finance', body: 'Vendor payments in Finance dept show 3.4σ deviation from historical baseline on Dec 12–14. Requires manual review. No fraud indicators flagged yet.', confidence: 79, impact: 'Low', time: '1h ago' },
  { type: 'opportunity', icon: 'Sparkles' as const, color: C.primary, title: 'Customer Upsell Opportunity', body: 'AI identified 142 accounts with usage patterns predictive of upgrade readiness. Estimated pipeline value: $1.8M if 22% conversion rate achieved.', confidence: 82, impact: 'High', time: '3h ago' },
  { type: 'risk', icon: 'ShieldAlert' as const, color: C.danger, title: 'Support SLA Breach Risk', body: 'Current ticket backlog trajectory projects SLA breach probability of 34% by EOW. 3 critical tickets aging beyond 48h threshold. Immediate escalation recommended.', confidence: 91, impact: 'High', time: '5h ago' },
];

export const actions = [
  { label: 'Review APAC pipeline', done: false, priority: 'high' },
  { label: 'Reallocate Marketing budget', done: false, priority: 'high' },
  { label: 'Escalate Finance anomaly', done: false, priority: 'medium' },
  { label: 'Upsell campaign briefing', done: true, priority: 'medium' },
  { label: 'Support SLA escalation', done: false, priority: 'high' },
];

export const health = [
  { label: 'Growth Velocity', val: 'Strong', color: C.success },
  { label: 'Risk Level', val: 'Low', color: C.success },
  { label: 'Efficiency', val: 'Above Avg', color: C.primary },
  { label: 'Momentum', val: 'Positive', color: C.ai },
];
