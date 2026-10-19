import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AnalyticsTabs, AnalyticsTabId } from '../../components/analytics-tabs/analytics-tabs';
import { DistributionTab } from '../../components/distribution-tab/distribution-tab';
import { Icon } from '../../components/icon/icon';
import { PerformanceTab } from '../../components/performance-tab/performance-tab';
import { RevenueTab } from '../../components/revenue-tab/revenue-tab';
import { AnalyticsSectionHeader } from '../../components/section-header/section-header';
import { TrendsTab } from '../../components/trends-tab/trends-tab';
import { C } from '../../data/analytics-data';

@Component({
  selector: 'app-analytics',
  imports: [AnalyticsSectionHeader, AnalyticsTabs, RevenueTab, PerformanceTab, TrendsTab, DistributionTab, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './analytics.html',
  styleUrl: './analytics.css',
})
export class Analytics {
  readonly C = C;
  readonly tab = signal<AnalyticsTabId>('revenue');

  setTab(tab: AnalyticsTabId) {
    this.tab.set(tab);
  }
}
