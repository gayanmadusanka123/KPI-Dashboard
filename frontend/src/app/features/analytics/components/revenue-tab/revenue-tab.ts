import { ChangeDetectionStrategy, Component } from '@angular/core';
import { C, analyticsRevenue, channelData } from '../../data/analytics-data';
import { CartesianChart, CartesianSeries } from '../charts/cartesian-chart';

@Component({
  selector: 'app-analytics-revenue-tab',
  imports: [CartesianChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './revenue-tab.html',
  styleUrl: './revenue-tab.css',
})
export class RevenueTab {
  readonly C = C;
  readonly analyticsRevenue = analyticsRevenue;
  readonly channelData = channelData;

  readonly revenueStats = [
    { label: 'Total Revenue', value: '$84.3M', change: '+18.3%', color: C.primary },
    { label: 'Total Profit', value: '$30.1M', change: '+31.2%', color: C.success },
    { label: 'Avg Monthly', value: '$7.0M', change: '+15.8%', color: C.ai },
  ];

  readonly revenueAreaSeries: CartesianSeries[] = [
    { key: 'revenue', name: 'Revenue', color: C.primary, type: 'area', strokeWidth: 2.5, gradientOpacity: 0.3 },
    { key: 'profit', name: 'Profit', color: C.success, type: 'area', strokeWidth: 2.5, gradientOpacity: 0.3 },
  ];

  readonly channelBarSeries: CartesianSeries[] = [
    { key: 'revenue', name: 'Revenue $M', color: C.primary, type: 'bar', radius: [0, 6, 6, 0] },
  ];
}
