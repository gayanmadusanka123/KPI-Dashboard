import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Icon } from '../icon/icon';
import { IconName } from '../icon/icons';
import { C } from '../../data/analytics-data';

export type AnalyticsTabId = 'revenue' | 'performance' | 'trends' | 'distribution';

@Component({
  selector: 'app-analytics-tabs',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './analytics-tabs.html',
  styleUrl: './analytics-tabs.css',
})
export class AnalyticsTabs {
  readonly active = input.required<AnalyticsTabId>();
  readonly activeChange = output<AnalyticsTabId>();
  readonly C = C;

  readonly tabs: { id: AnalyticsTabId; label: string; icon: IconName }[] = [
    { id: 'revenue', label: 'Revenue', icon: 'DollarSign' },
    { id: 'performance', label: 'Performance', icon: 'BarChart2' },
    { id: 'trends', label: 'Growth Trends', icon: 'TrendingUp' },
    { id: 'distribution', label: 'Distribution', icon: 'Layers' },
  ];

  select(id: AnalyticsTabId) { this.activeChange.emit(id); }
}
