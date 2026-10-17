import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { C } from '../../data/analytics-data';

export interface TipItem {
  name: string;
  value: number | string;
  color: string;
}

/** Equivalent of the `ChartTip` custom tooltip in the React app. */
@Component({
  selector: 'app-chart-tip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="rounded-xl border px-3 py-2.5 text-xs shadow-xl"
      style="background-color: #0F1A2E"
      [style.borderColor]="C.border"
    >
      @if (label()) {
        <p class="mb-1.5 font-semibold" [style.color]="C.text">{{ label() }}</p>
      }
      @for (p of payload(); track p.name) {
        <p [style.color]="p.color">
          {{ p.name }}: <span class="font-bold tabular-nums">{{ p.value }}</span>
        </p>
      }
    </div>
  `,
  styles: [':host { display: block; }'],
})
export class ChartTip {
  readonly label = input<string>('');
  readonly payload = input<TipItem[]>([]);
  readonly C = C;
}
