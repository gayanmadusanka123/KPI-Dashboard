import { ChangeDetectionStrategy, Component } from '@angular/core';
import { C, deptPerf, heatRows } from '../../data/analytics-data';
import { CartesianChart, CartesianSeries } from '../charts/cartesian-chart';
import { RadarChart, RadarSeries } from '../charts/polar-charts';

@Component({
  selector: 'app-analytics-performance-tab',
  imports: [CartesianChart, RadarChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './performance-tab.html',
  styleUrl: './performance-tab.css',
})
export class PerformanceTab {
  readonly C = C;
  readonly deptPerf = deptPerf;
  readonly heatRows = heatRows;
  readonly days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  readonly deptBarSeries: CartesianSeries[] = [
    { key: 'target', name: 'Target', color: C.border, type: 'bar', radius: [4, 4, 0, 0] },
    { key: 'kpi', name: 'KPI', color: C.primary, type: 'bar', radius: [4, 4, 0, 0] },
  ];

  readonly deptRadar = deptPerf.map((d) => ({ name: d.dept, kpi: d.kpi, target: d.target }));

  readonly deptRadarSeries: RadarSeries[] = [
    { key: 'kpi', name: 'KPI', color: C.primary, fillOpacity: 0.25 },
    { key: 'target', name: 'Target', color: C.success, fillOpacity: 0.1, dash: '4 4' },
  ];

  private intensity(score: number) { return (score - 60) / 40; }
  heatBg(score: number) { return `rgba(139,92,246,${Math.max(0.08, this.intensity(score))})`; }
  heatText(score: number) { return this.intensity(score) > 0.5 ? C.text : C.sub; }
  heatBorder(score: number) { return `1px solid rgba(139,92,246,${Math.max(0.12, this.intensity(score) * 0.6)})`; }
}
