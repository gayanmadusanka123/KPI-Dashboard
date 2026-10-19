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
import {
  DEFAULT_MARGIN,
  Margin,
  formatTick,
  monotonePath,
  niceTicks,
  roundedRect,
} from './chart-utils';

export interface CartesianSeries {
  key: string;
  name: string;
  color: string;
  /** Defaults to 'line'. */
  type?: 'line' | 'area' | 'bar';
  strokeWidth?: number;
  dash?: string;
  /** Top opacity of the area gradient fill (recharts `<linearGradient>` equivalent). */
  gradientOpacity?: number;
  /** Radius of the dot rendered at each point; `0` hides dots. */
  dot?: number;
  /** Bar corner radii: [topLeft, topRight, bottomRight, bottomLeft]. */
  radius?: [number, number, number, number];
  /** Per-index bar colors — the equivalent of recharts `<Cell />`. */
  cellColors?: string[];
}

const X_AXIS_HEIGHT = 30;
const LEGEND_HEIGHT = 30;
let uidCounter = 0;

/**
 * Renders line / area / bar series on a shared cartesian grid.
 * Mirrors the recharts `LineChart`, `AreaChart` and `BarChart` usage in the
 * original React app, including axes, dashed grid, tooltip and legend.
 */
@Component({
  selector: 'app-cartesian-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChartTip],
  template: `
    <div
      #wrap
      class="relative w-full"
      [style.height.px]="height()"
      (mousemove)="onMove($event)"
      (mouseleave)="hoverIndex.set(null)"
    >
      @if (width() > 0) {
        <svg [attr.width]="width()" [attr.height]="svgHeight()" style="display: block">
          <defs>
            @for (s of series(); track s.key) {
              @if (s.type === 'area') {
                <linearGradient [attr.id]="gradId(s.key)" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" [attr.stop-color]="s.color" [attr.stop-opacity]="s.gradientOpacity ?? 0.3" />
                  <stop offset="100%" [attr.stop-color]="s.color" stop-opacity="0" />
                </linearGradient>
              }
            }
          </defs>

          <!-- grid -->
          @if (gridHorizontal()) {
            @for (t of horizontalGridY(); track $index) {
              <line
                [attr.x1]="plotLeft()"
                [attr.x2]="plotRight()"
                [attr.y1]="t"
                [attr.y2]="t"
                [attr.stroke]="C.border"
                stroke-dasharray="3 3"
              />
            }
          }
          @if (gridVertical()) {
            @for (t of verticalGridX(); track $index) {
              <line
                [attr.x1]="t"
                [attr.x2]="t"
                [attr.y1]="plotTop()"
                [attr.y2]="plotBottom()"
                [attr.stroke]="C.border"
                stroke-dasharray="3 3"
              />
            }
          }

          <!-- axes labels -->
          @for (t of yAxisTicks(); track $index) {
            <text
              [attr.x]="plotLeft() - 8"
              [attr.y]="t.pos + 4"
              text-anchor="end"
              [attr.fill]="C.sub"
              font-size="11"
            >
              {{ t.label }}
            </text>
          }
          @for (t of xAxisTicks(); track $index) {
            <text
              [attr.x]="t.pos"
              [attr.y]="plotBottom() + 18"
              [attr.text-anchor]="t.anchor"
              [attr.fill]="C.sub"
              font-size="11"
            >
              {{ t.label }}
            </text>
          }

          <!-- bars -->
          @for (b of bars(); track $index) {
            <path [attr.d]="b.d" [attr.fill]="b.color" />
          }

          <!-- areas -->
          @for (a of areas(); track a.key) {
            <path [attr.d]="a.fill" [attr.fill]="'url(#' + gradId(a.key) + ')'" stroke="none" />
            <path
              [attr.d]="a.line"
              fill="none"
              [attr.stroke]="a.color"
              [attr.stroke-width]="a.strokeWidth"
            />
          }

          <!-- lines -->
          @for (l of lines(); track l.key) {
            <path
              [attr.d]="l.d"
              fill="none"
              [attr.stroke]="l.color"
              [attr.stroke-width]="l.strokeWidth"
              [attr.stroke-dasharray]="l.dash"
            />
          }

          <!-- dots -->
          @for (d of dots(); track $index) {
            <circle [attr.cx]="d.x" [attr.cy]="d.y" [attr.r]="d.r" [attr.fill]="d.color" />
          }

          <!-- hover cursor -->
          @if (hoverIndex() !== null) {
            @if (layout() === 'horizontal') {
              <line
                [attr.x1]="cursorPos()"
                [attr.x2]="cursorPos()"
                [attr.y1]="plotTop()"
                [attr.y2]="plotBottom()"
                [attr.stroke]="C.border"
                stroke-width="1"
              />
            }
          }
        </svg>
      }

      @if (legend()) {
        <div
          class="flex items-center justify-center gap-4 flex-wrap"
          style="padding-top: 12px; font-size: 12px"
          [style.height.px]="LEGEND_HEIGHT"
        >
          @for (s of series(); track s.key) {
            <span class="flex items-center gap-1.5" [style.color]="C.sub">
              <span
                class="inline-block rounded-sm"
                style="width: 12px; height: 12px"
                [style.backgroundColor]="s.color"
              ></span>
              {{ s.name }}
            </span>
          }
        </div>
      }

      @if (hoverIndex() !== null) {
        <div
          class="absolute pointer-events-none z-20"
          [style.left.px]="tipLeft()"
          [style.top.px]="tipTop()"
        >
          <app-chart-tip [label]="tipLabel()" [payload]="tipPayload()" />
        </div>
      }
    </div>
  `,
  styles: [':host { display: block; width: 100%; }'],
})
export class CartesianChart implements AfterViewInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly wrap = viewChild.required<ElementRef<HTMLDivElement>>('wrap');
  private observer?: ResizeObserver;
  private readonly uid = `cc${++uidCounter}`;

  readonly data = input.required<Record<string, any>[]>();
  readonly xKey = input.required<string>();
  readonly series = input.required<CartesianSeries[]>();
  readonly height = input<number>(200);
  readonly margin = input<Margin>(DEFAULT_MARGIN);
  readonly legend = input<boolean>(false);
  readonly yDomain = input<[number, number] | null>(null);
  readonly layout = input<'horizontal' | 'vertical'>('horizontal');
  readonly gridHorizontal = input<boolean>(true);
  readonly gridVertical = input<boolean>(true);
  readonly yAxisWidth = input<number>(60);

  readonly width = signal(0);
  readonly hoverIndex = signal<number | null>(null);
  readonly pointer = signal({ x: 0, y: 0 });

  readonly C = C;
  readonly LEGEND_HEIGHT = LEGEND_HEIGHT;

  gradId(key: string) {
    return `${this.uid}-${key}`;
  }

  ngAfterViewInit() {
    const el = this.host.nativeElement as HTMLElement;
    this.observer = new ResizeObserver(() => this.width.set(el.clientWidth));
    this.observer.observe(el);
    this.width.set(el.clientWidth);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  // ─── geometry ───────────────────────────────────────────────────────────────
  readonly svgHeight = computed(() => this.height() - (this.legend() ? LEGEND_HEIGHT : 0));
  readonly plotLeft = computed(() => this.yAxisWidth() + this.margin().left);
  readonly plotRight = computed(() => this.width() - this.margin().right);
  readonly plotTop = computed(() => this.margin().top);
  readonly plotBottom = computed(() => this.svgHeight() - X_AXIS_HEIGHT - this.margin().bottom);
  readonly plotW = computed(() => Math.max(0, this.plotRight() - this.plotLeft()));
  readonly plotH = computed(() => Math.max(0, this.plotBottom() - this.plotTop()));

  private readonly hasBars = computed(() => this.series().some((s) => s.type === 'bar'));

  private readonly maxValue = computed(() => {
    let max = 0;
    for (const row of this.data()) {
      for (const s of this.series()) {
        const v = Number(row[s.key]);
        if (isFinite(v) && v > max) max = v;
      }
    }
    return max;
  });

  readonly ticks = computed(() => {
    const domain = this.yDomain();
    if (domain) return niceTicks(domain[0], domain[1], 5);
    return niceTicks(0, this.maxValue() || 1, 5);
  });

  private readonly numMin = computed(() => this.ticks()[0]);
  private readonly numMax = computed(() => this.ticks()[this.ticks().length - 1]);

  /** Numeric value → pixel along the value axis. */
  private toPixel(v: number): number {
    const min = this.numMin();
    const max = this.numMax();
    const ratio = max === min ? 0 : (v - min) / (max - min);
    return this.layout() === 'horizontal'
      ? this.plotBottom() - ratio * this.plotH()
      : this.plotLeft() + ratio * this.plotW();
  }

  /** Category index → pixel along the category axis. */
  private catPixel(i: number): number {
    const n = this.data().length;
    if (this.layout() === 'vertical') {
      const band = this.plotH() / Math.max(1, n);
      return this.plotTop() + band * (i + 0.5);
    }
    if (this.hasBars()) {
      const band = this.plotW() / Math.max(1, n);
      return this.plotLeft() + band * (i + 0.5);
    }
    if (n <= 1) return this.plotLeft() + this.plotW() / 2;
    return this.plotLeft() + (this.plotW() * i) / (n - 1);
  }

  readonly yAxisTicks = computed(() => {
    if (this.layout() === 'vertical') {
      return this.data().map((row, i) => ({
        label: String(row[this.xKey()]),
        pos: this.catPixel(i),
      }));
    }
    return this.ticks().map((t) => ({ label: formatTick(t), pos: this.toPixel(t) }));
  });

  /**
   * Keeps the outermost labels inside the plot instead of letting them clip at
   * the SVG edge — the same adjustment recharts makes to its end ticks.
   */
  private anchorFor(label: string, pos: number): 'start' | 'middle' | 'end' {
    const halfWidth = (label.length * 6) / 2;
    if (pos + halfWidth > this.width()) return 'end';
    if (pos - halfWidth < 0) return 'start';
    return 'middle';
  }

  readonly xAxisTicks = computed(() => {
    const source =
      this.layout() === 'vertical'
        ? this.ticks().map((t) => ({ label: formatTick(t), pos: this.toPixel(t) }))
        : this.data().map((row, i) => ({
            label: String(row[this.xKey()]),
            pos: this.catPixel(i),
          }));
    return source.map((t) => ({ ...t, anchor: this.anchorFor(t.label, t.pos) }));
  });

  readonly horizontalGridY = computed(() =>
    this.layout() === 'horizontal' ? this.ticks().map((t) => this.toPixel(t)) : [],
  );

  readonly verticalGridX = computed(() => {
    if (this.layout() === 'vertical') return this.ticks().map((t) => this.toPixel(t));
    return this.data().map((_, i) => this.catPixel(i));
  });

  // ─── series rendering ───────────────────────────────────────────────────────
  private points(key: string) {
    return this.data().map((row, i) => {
      const v = Number(row[key]);
      return this.layout() === 'vertical'
        ? { x: this.toPixel(v), y: this.catPixel(i) }
        : { x: this.catPixel(i), y: this.toPixel(v) };
    });
  }

  readonly lines = computed(() =>
    this.series()
      .filter((s) => (s.type ?? 'line') === 'line')
      .map((s) => ({
        key: s.key,
        color: s.color,
        strokeWidth: s.strokeWidth ?? 2,
        dash: s.dash ?? null,
        d: monotonePath(this.points(s.key)),
      })),
  );

  readonly areas = computed(() =>
    this.series()
      .filter((s) => s.type === 'area')
      .map((s) => {
        const pts = this.points(s.key);
        const line = monotonePath(pts);
        const base = this.plotBottom();
        const fill =
          pts.length > 0
            ? `${line} L${pts[pts.length - 1].x},${base} L${pts[0].x},${base} Z`
            : '';
        return {
          key: s.key,
          color: s.color,
          strokeWidth: s.strokeWidth ?? 2,
          line,
          fill,
        };
      }),
  );

  readonly bars = computed(() => {
    const barSeries = this.series().filter((s) => s.type === 'bar');
    if (barSeries.length === 0) return [];
    const n = this.data().length;
    const out: { d: string; color: string }[] = [];
    const gap = 4;

    if (this.layout() === 'vertical') {
      const band = this.plotH() / Math.max(1, n);
      const inner = band * 0.8;
      const thickness = (inner - gap * (barSeries.length - 1)) / barSeries.length;
      this.data().forEach((row, i) => {
        barSeries.forEach((s, si) => {
          const v = Number(row[s.key]) || 0;
          const y = this.plotTop() + band * i + band * 0.1 + si * (thickness + gap);
          const x = this.plotLeft();
          const w = this.toPixel(v) - x;
          out.push({
            d: roundedRect(x, y, w, thickness, s.radius ?? [0, 0, 0, 0]),
            color: s.cellColors?.[i] ?? s.color,
          });
        });
      });
      return out;
    }

    const band = this.plotW() / Math.max(1, n);
    const inner = band * 0.8;
    const thickness = (inner - gap * (barSeries.length - 1)) / barSeries.length;
    this.data().forEach((row, i) => {
      barSeries.forEach((s, si) => {
        const v = Number(row[s.key]) || 0;
        const x = this.plotLeft() + band * i + band * 0.1 + si * (thickness + gap);
        const y = this.toPixel(v);
        const h = this.plotBottom() - y;
        out.push({
          d: roundedRect(x, y, thickness, h, s.radius ?? [0, 0, 0, 0]),
          color: s.cellColors?.[i] ?? s.color,
        });
      });
    });
    return out;
  });

  readonly dots = computed(() => {
    const out: { x: number; y: number; r: number; color: string }[] = [];
    for (const s of this.series()) {
      const r = s.dot ?? 0;
      if (!r || s.type === 'bar') continue;
      this.points(s.key).forEach((p) => out.push({ ...p, r, color: s.color }));
    }
    return out;
  });

  // ─── tooltip ────────────────────────────────────────────────────────────────
  onMove(event: MouseEvent) {
    const rect = this.wrap().nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.pointer.set({ x, y });

    const n = this.data().length;
    if (n === 0) return;

    let index: number;
    if (this.layout() === 'vertical') {
      const band = this.plotH() / n;
      index = Math.floor((y - this.plotTop()) / band);
    } else if (this.hasBars()) {
      const band = this.plotW() / n;
      index = Math.floor((x - this.plotLeft()) / band);
    } else {
      const step = n > 1 ? this.plotW() / (n - 1) : this.plotW();
      index = Math.round((x - this.plotLeft()) / step);
    }
    this.hoverIndex.set(index >= 0 && index < n ? index : null);
  }

  readonly cursorPos = computed(() => {
    const i = this.hoverIndex();
    return i === null ? 0 : this.catPixel(i);
  });

  readonly tipLabel = computed(() => {
    const i = this.hoverIndex();
    return i === null ? '' : String(this.data()[i][this.xKey()]);
  });

  readonly tipPayload = computed<TipItem[]>(() => {
    const i = this.hoverIndex();
    if (i === null) return [];
    const row = this.data()[i];
    return this.series().map((s) => ({
      name: s.name,
      value: row[s.key],
      color: s.cellColors?.[i] ?? s.color,
    }));
  });

  readonly tipLeft = computed(() => {
    const p = this.pointer();
    const maxLeft = Math.max(0, this.width() - 170);
    return Math.min(maxLeft, p.x + 12);
  });

  readonly tipTop = computed(() => Math.max(0, this.pointer().y - 20));
}
