export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export const DEFAULT_MARGIN: Margin = { top: 5, right: 5, bottom: 5, left: 5 };

/** Recharts-style "nice" tick generation for a numeric axis. */
export function niceTicks(min: number, max: number, count = 5): number[] {
  if (!isFinite(min) || !isFinite(max)) return [0];
  if (min === max) {
    max = min + 1;
  }
  const span = max - min;
  const rawStep = span / (count - 1);
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / mag;
  let step: number;
  if (norm <= 1) step = 1;
  else if (norm <= 2) step = 2;
  else if (norm <= 2.5) step = 2.5;
  else if (norm <= 5) step = 5;
  else step = 10;
  step *= mag;

  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = niceMin; v <= niceMax + step / 1000; v += step) {
    ticks.push(+v.toFixed(10));
  }
  return ticks;
}

export function formatTick(v: number): string {
  if (Number.isInteger(v)) return String(v);
  return String(+v.toFixed(2));
}

/** Rounded-rectangle path. `r` is [topLeft, topRight, bottomRight, bottomLeft]. */
export function roundedRect(
  x: number,
  y: number,
  w: number,
  h: number,
  r: [number, number, number, number],
): string {
  const lim = Math.min(Math.abs(w), Math.abs(h)) / 2;
  const [tl, tr, br, bl] = r.map((v) => Math.max(0, Math.min(v, lim))) as [
    number,
    number,
    number,
    number,
  ];
  return [
    `M${x + tl},${y}`,
    `H${x + w - tr}`,
    tr ? `A${tr},${tr} 0 0 1 ${x + w},${y + tr}` : '',
    `V${y + h - br}`,
    br ? `A${br},${br} 0 0 1 ${x + w - br},${y + h}` : '',
    `H${x + bl}`,
    bl ? `A${bl},${bl} 0 0 1 ${x},${y + h - bl}` : '',
    `V${y + tl}`,
    tl ? `A${tl},${tl} 0 0 1 ${x + tl},${y}` : '',
    'Z',
  ]
    .filter(Boolean)
    .join(' ');
}

/**
 * Monotone cubic interpolation — matches recharts' `type="monotone"` curves.
 */
export function monotonePath(points: { x: number; y: number }[]): string {
  const n = points.length;
  if (n === 0) return '';
  if (n === 1) return `M${points[0].x},${points[0].y}`;
  if (n === 2) return `M${points[0].x},${points[0].y} L${points[1].x},${points[1].y}`;

  const dx: number[] = [];
  const dy: number[] = [];
  const ms: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = points[i + 1].x - points[i].x;
    dy[i] = points[i + 1].y - points[i].y;
    ms[i] = dy[i] / dx[i];
  }

  const tangents: number[] = new Array(n);
  tangents[0] = ms[0];
  tangents[n - 1] = ms[n - 2];
  for (let i = 1; i < n - 1; i++) {
    if (ms[i - 1] * ms[i] <= 0) {
      tangents[i] = 0;
    } else {
      const common = dx[i - 1] + dx[i];
      tangents[i] =
        (3 * common) /
        ((common + dx[i]) / ms[i - 1] + (common + dx[i - 1]) / ms[i]);
    }
  }

  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const x0 = points[i].x;
    const y0 = points[i].y;
    const x1 = points[i + 1].x;
    const y1 = points[i + 1].y;
    const h = (x1 - x0) / 3;
    d += ` C${x0 + h},${y0 + tangents[i] * h} ${x1 - h},${y1 - tangents[i + 1] * h} ${x1},${y1}`;
  }
  return d;
}

export function polarPoint(cx: number, cy: number, radius: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

/** SVG arc path for pie / donut slices. */
export function arcPath(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number,
): string {
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  const so = polarPoint(cx, cy, outerR, startAngle);
  const eo = polarPoint(cx, cy, outerR, endAngle);
  if (innerR <= 0) {
    return `M${cx},${cy} L${so.x},${so.y} A${outerR},${outerR} 0 ${largeArc} 1 ${eo.x},${eo.y} Z`;
  }
  const si = polarPoint(cx, cy, innerR, startAngle);
  const ei = polarPoint(cx, cy, innerR, endAngle);
  return [
    `M${so.x},${so.y}`,
    `A${outerR},${outerR} 0 ${largeArc} 1 ${eo.x},${eo.y}`,
    `L${ei.x},${ei.y}`,
    `A${innerR},${innerR} 0 ${largeArc} 0 ${si.x},${si.y}`,
    'Z',
  ].join(' ');
}
