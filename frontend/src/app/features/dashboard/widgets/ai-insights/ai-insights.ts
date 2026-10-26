import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  mockInsights,
  type InsightType,
} from '../../data/mockInsights';

@Component({
  selector: 'app-ai-insights',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-insights.html',
  styleUrl: './ai-insights.css',
})
export class AiInsights {
  readonly insights = mockInsights;

  readonly dismissed = signal<Set<string>>(new Set());

  readonly visibleInsights = computed(() =>
    this.insights.filter(
      insight => !this.dismissed().has(insight.id)
    )
  );

  readonly typeConfig: Record<
    InsightType,
    { bg: string; color: string; icon: string }
  > = {
    Anomaly: {
      bg: '#FEE2E2',
      color: '#991B1B',
      icon: '⚡',
    },
    Trend: {
      bg: '#DCFCE7',
      color: '#166534',
      icon: '↗',
    },
    Forecast: {
      bg: '#EFF6FF',
      color: '#1E40AF',
      icon: '◈',
    },
    Benchmark: {
      bg: '#F3E8FF',
      color: '#6B21A8',
      icon: '◎',
    },
  };

  dismissInsight(id: string): void {
    this.dismissed.update(current => {
      const next = new Set(current);
      next.add(id);
      return next;
    });
  }

  getRelevancePercentage(score: number): number {
    return Math.round(score * 100);
  }
}