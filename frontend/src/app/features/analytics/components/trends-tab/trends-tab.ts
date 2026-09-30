import { ChangeDetectionStrategy, Component } from '@angular/core';
import { C, growthData, monthlyData } from '../../data/analytics-data';
import { CartesianChart, CartesianSeries } from '../charts/cartesian-chart';

@Component({
  selector: 'app-analytics-trends-tab',
  imports: [CartesianChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './trends-tab.html',
  styleUrl: './trends-tab.css',
})
export class TrendsTab {
  readonly C = C;
  readonly growthData = growthData;
  readonly monthlyData = monthlyData;

  readonly growthSeries: CartesianSeries[] = [
    { key: 'growth', name: 'Growth %', color: C.ai, type: 'area', strokeWidth: 2.5, gradientOpacity: 0.4, dot: 4 },
  ];

  readonly momSeries: CartesianSeries[] = [
    {
      key: 'revenue',
      name: 'Revenue',
      color: C.primary,
      type: 'bar',
      radius: [4, 4, 0, 0],
      cellColors: monthlyData.map((_, i) => i === monthlyData.length - 1 ? C.primary : `${C.primary}66`),
    },
  ];
}
