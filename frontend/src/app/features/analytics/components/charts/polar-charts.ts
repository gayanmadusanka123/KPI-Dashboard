import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { C } from '../../data/analytics-data';
import { ChartTip, TipItem } from './chart-tip';
import { arcPath, polarPoint } from './chart-utils';

/** Equivalent of the recharts `<PieChart>` with `<Pie>` + `<Cell>`. */
@Component({
  selector: 'app-pie-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChartTip],
  template: `
    <div
      #wrap
      class="relative w-full"
      [style.height.px]="height()"
      (mousemove)="pointer.set({ x: $event.clientX - bounds().left, y: $event.clientY - bounds().top })"
      (mouseleave)="hover.set(null)"
    >
      @if (width() > 0) {
        <svg [attr.width]="width()" [attr.height]="height()" style="display: block">
          @for (s of slices(); track $index) {
            <path
              [attr.d]="s.d"
              [attr.fill]="s.color"
              [attr.opacity]="hover() === null || hover() === $index ? 1 : 0.75"
              style="cursor: pointer"
              (mouseenter)="hover.set($index)"
            />
          }
        </svg>
      }
      @if (hover() !== null) {
        <div class="absolute pointer-events-none z-20" [style.left.px]="tipLeft()" [style.top.px]="tipTop()">
          <app-chart-tip [payload]="tipPayload()" />
        </div>
      }
    </div>
  `,
  styles: [':host { display: block; width: 100%; }'],
})
export class PieChart implements AfterViewInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly wrap = viewChild.required<ElementRef<HTMLDivElement>>('wrap');
  private observer?: ResizeObserver;

  readonly data = input.required<Record<string, any>[]>();
  readonly valueKey = input.required<string>();
  readonly nameKey = input.required<string>();
  readonly colors = input.required<string[]>();
  readonly height = input<number>(200);
  readonly innerRadius = input<number>(0);
  readonly outerRadius = input<number>(85);
  readonly paddingAngle = input<number>(0);

  readonly width = signal(0);
  readonly hover = signal<number | null>(null);
  readonly pointer = signal({ x: 0, y: 0 });

  ngAfterViewInit() {
    const el = this.host.nativeElement as HTMLElement;
    this.observer = new ResizeObserver(() => this.width.set(el.clientWidth));
    this.observer.observe(el);
    this.width.set(el.clientWidth);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  bounds() {
    return this.wrap().nativeElement.getBoundingClientRect();
  }

  readonly slices = computed(() => {
    const total = this.data().reduce((a, d) => a + Number(d[this.valueKey()] || 0), 0);
    const cx = this.width() / 2;
    const cy = this.height() / 2;
    const pad = this.paddingAngle();
    let angle = 0;
    return this.data().map((d, i) => {
      const share = total === 0 ? 0 : Number(d[this.valueKey()]) / total;
      const start = angle;
      const end = angle + share * 360;
      angle = end;
      return {
        d: arcPath(
          cx,
          cy,
          this.innerRadius(),
          this.outerRadius(),
          start + pad / 2,
          Math.max(start + pad / 2, end - pad / 2),
        ),
        color: this.colors()[i % this.colors().length],
      };
    });
  });

  readonly tipPayload = computed<TipItem[]>(() => {
    const i = this.hover();
    if (i === null) return [];
    const row = this.data()[i];
    return [
      {
        name: String(row[this.nameKey()]),
        value: row[this.valueKey()],
        color: this.colors()[i % this.colors().length],
      },
    ];
  });

  readonly tipLeft = computed(() => Math.min(Math.max(0, this.width() - 170), this.pointer().x + 12));
  readonly tipTop = computed(() => Math.max(0, this.pointer().y - 20));
}

export interface RadarSeries {
  key: string;
  name: string;
  color: string;
  fillOpacity: number;
  dash?: string;
}

/** Equivalent of the recharts `<RadarChart>` with `<PolarGrid>` and `<Radar>`. */
@Component({
  selector: 'app-radar-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #wrap class="relative w-full" [style.height.px]="height()">
      @if (width() > 0) {
        <svg [attr.width]="width()" [attr.height]="svgHeight()" style="display: block">
          <!-- polar grid rings -->
          @for (ring of rings(); track $index) {
            <polygon [attr.points]="ring" fill="none" [attr.stroke]="C.border" />
          }
          <!-- spokes -->
          @for (spoke of spokes(); track $index) {
            <line
              [attr.x1]="cx()"
              [attr.y1]="cy()"
              [attr.x2]="spoke.x"
              [attr.y2]="spoke.y"
              [attr.stroke]="C.border"
            />
          }
          <!-- series -->
          @for (s of shapes(); track s.key) {
            <polygon
              [attr.points]="s.points"
              [attr.fill]="s.color"
              [attr.fill-opacity]="s.fillOpacity"
              [attr.stroke]="s.color"
              [attr.stroke-dasharray]="s.dash"
              stroke-width="2"
            />
          }
          <!-- axis labels -->
          @for (l of labels(); track $index) {
            <text
              [attr.x]="l.x"
              [attr.y]="l.y"
              [attr.text-anchor]="l.anchor"
              [attr.fill]="C.sub"
              font-size="11"
              dominant-baseline="middle"
            >
              {{ l.text }}
            </text>
          }
        </svg>
      }
      @if (legend()) {
        <div class="flex items-center justify-center gap-4 flex-wrap" style="padding-top: 12px; font-size: 12px">
          @for (s of series(); track s.key) {
            <span class="flex items-center gap-1.5" [style.color]="C.sub">
              <span class="inline-block rounded-sm" style="width: 12px; height: 12px" [style.backgroundColor]="s.color"></span>
              {{ s.name }}
            </span>
          }
        </div>
      }
    </div>
  `,
  styles: [':host { display: block; width: 100%; }'],
})
export class RadarChart implements AfterViewInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private observer?: ResizeObserver;

  readonly data = input.required<Record<string, any>[]>();
  readonly nameKey = input.required<string>();
  readonly series = input.required<RadarSeries[]>();
  readonly height = input<number>(300);
  readonly legend = input<boolean>(false);
  readonly max = input<number>(100);

  readonly width = signal(0);
  readonly C = C;

  ngAfterViewInit() {
    const el = this.host.nativeElement as HTMLElement;
    this.observer = new ResizeObserver(() => this.width.set(el.clientWidth));
    this.observer.observe(el);
    this.width.set(el.clientWidth);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  readonly svgHeight = computed(() => this.height() - (this.legend() ? 30 : 0));
  readonly cx = computed(() => this.width() / 2);
  readonly cy = computed(() => this.svgHeight() / 2);
  readonly radius = computed(() => Math.max(0, Math.min(this.cx(), this.cy()) - 34));

  private angle(i: number) {
    return (360 / this.data().length) * i;
  }

  readonly rings = computed(() =>
    [0.25, 0.5, 0.75, 1].map((f) =>
      this.data()
        .map((_, i) => {
          const p = polarPoint(this.cx(), this.cy(), this.radius() * f, this.angle(i));
          return `${p.x},${p.y}`;
        })
        .join(' '),
    ),
  );

  readonly spokes = computed(() =>
    this.data().map((_, i) => polarPoint(this.cx(), this.cy(), this.radius(), this.angle(i))),
  );

  readonly shapes = computed(() =>
    this.series().map((s) => ({
      key: s.key,
      color: s.color,
      fillOpacity: s.fillOpacity,
      dash: s.dash ?? null,
      points: this.data()
        .map((row, i) => {
          const ratio = Math.min(1, Number(row[s.key] || 0) / this.max());
          const p = polarPoint(this.cx(), this.cy(), this.radius() * ratio, this.angle(i));
          return `${p.x},${p.y}`;
        })
        .join(' '),
    })),
  );

  readonly labels = computed(() =>
    this.data().map((row, i) => {
      const a = this.angle(i);
      const p = polarPoint(this.cx(), this.cy(), this.radius() + 16, a);
      const anchor = a === 0 || Math.abs(a - 180) < 1 ? 'middle' : a < 180 ? 'start' : 'end';
      return { x: p.x, y: p.y, anchor, text: String(row[this.nameKey()]) };
    }),
  );
}
