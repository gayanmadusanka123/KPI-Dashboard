import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { C } from '../../data/analytics-data';

@Component({
  selector: 'app-analytics-section-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './section-header.html',
  styleUrl: './section-header.css',
})
export class AnalyticsSectionHeader {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
  readonly C = C;
}
