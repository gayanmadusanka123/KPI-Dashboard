import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { mockKPIs, type KPI } from '../../data/mockKPIs';

type PerformerVariant = 'top' | 'bottom';

@Component({
  selector: 'app-top-bottom-performers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-bottom-performers.html',
  styleUrl: './top-bottom-performers.css',
})
export class TopBottomPerformers {
  readonly sorted = [...mockKPIs].sort(
    (a, b) => b.performanceScore - a.performanceScore
  );

  readonly top5 = this.sorted.slice(0, 5);
  readonly bottom5 = this.sorted.slice(-5).reverse();

  readonly trendSymbols: Record<KPI['trend'], string> = {
    improving: '↑',
    stable: '→',
    declining: '↓',
  };

  readonly trendColors: Record<KPI['trend'], string> = {
    improving: '#16A34A',
    stable: '#64748B',
    declining: '#DC2626',
  };

  readonly styles = {
    top: {
      score: '#16A34A',
      rankBg: '#DCFCE7',
      rankColor: '#166534',
    },
    bottom: {
      score: '#DC2626',
      rankBg: '#FEE2E2',
      rankColor: '#991B1B',
    },
  } satisfies Record<
    PerformerVariant,
    { score: string; rankBg: string; rankColor: string }
  >;

  getTrendSymbol(trend: KPI['trend']): string {
    return this.trendSymbols[trend];
  }

  getTrendColor(trend: KPI['trend']): string {
    return this.trendColors[trend];
  }
}