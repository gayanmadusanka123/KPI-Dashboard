import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { mockForecasts } from '../../data/mockForecasts';

type SortBy = 'change' | 'confidence';
type Confidence = 'High' | 'Medium' | 'Low';

@Component({
  selector: 'app-forecast-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forecast-overview.html',
  styleUrl: './forecast-overview.css',
})
export class ForecastOverview {
  readonly forecasts = mockForecasts;

  sortBy: SortBy = 'change';

  readonly confidenceOrder: Record<Confidence, number> = {
    High: 0,
    Medium: 1,
    Low: 2,
  };

  readonly confidenceConfig: Record<
    Confidence,
    { bg: string; color: string }
  > = {
    High: {
      bg: '#DCFCE7',
      color: '#166534',
    },
    Medium: {
      bg: '#FEF3C7',
      color: '#92400E',
    },
    Low: {
      bg: '#FEE2E2',
      color: '#991B1B',
    },
  };

  get sortedForecasts() {
    return [...this.forecasts].sort((a, b) => {
      if (this.sortBy === 'change') {
        return b.forecastChangePct - a.forecastChangePct;
      }

      return (
        this.confidenceOrder[a.confidence] -
        this.confidenceOrder[b.confidence]
      );
    });
  }

  setSortBy(value: string): void {
    if (value === 'change' || value === 'confidence') {
      this.sortBy = value;
    }
  }
}