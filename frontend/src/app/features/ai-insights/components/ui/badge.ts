import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BadgeVariant, C } from '../../data/ai-insights-data';

const MAP: Record<BadgeVariant, { bg: string; color: string }> = {
  default: { bg: '#1E3A5F', color: C.primary },
  success: { bg: '#064E3B', color: C.success },
  warning: { bg: '#431407', color: C.warning },
  danger: { bg: '#450A0A', color: C.danger },
  ai: { bg: '#2E1065', color: C.ai },
};

@Component({
  selector: 'app-ai-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge" [style.backgroundColor]="style().bg" [style.color]="style().color"><ng-content /></span>`,
  styles: [`.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:999px;font-size:12px;font-weight:500;white-space:nowrap}`],
})
export class AiBadge {
  readonly variant = input<BadgeVariant>('default');
  readonly style = computed(() => MAP[this.variant()]);
}
