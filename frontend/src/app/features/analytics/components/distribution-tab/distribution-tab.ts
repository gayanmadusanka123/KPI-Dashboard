import { ChangeDetectionStrategy, Component } from '@angular/core';
import { C, PIE_COLORS, channelData, expenseData } from '../../data/analytics-data';
import { PieChart } from '../charts/polar-charts';

@Component({
  selector: 'app-analytics-distribution-tab',
  imports: [PieChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './distribution-tab.html',
  styleUrl: './distribution-tab.css',
})
export class DistributionTab {
  readonly C = C;
  readonly PIE_COLORS = PIE_COLORS;
  readonly channelData = channelData;
  readonly expenseData = expenseData;
}
