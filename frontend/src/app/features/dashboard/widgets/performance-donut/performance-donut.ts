import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart,
  ChartConfiguration,
  ChartData,
  ChartOptions,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

import { statusDistribution } from '../../data/mockKPIs';

Chart.register(ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-performance-donut',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './performance-donut.html',
  styleUrl: './performance-donut.css',
})
export class PerformanceDonut {
  readonly distribution = statusDistribution;

  activeSegment: string | null = null;

  readonly total = this.distribution.reduce(
    (sum, item) => sum + item.value,
    0
  );

  chartData: ChartData<'doughnut'> = {
    labels: this.distribution.map((item) => item.name),
    datasets: [
      {
        data: this.distribution.map((item) => item.value),
        backgroundColor: this.distribution.map((item) => item.color),
        hoverOffset: 5,
        borderWidth: 0,
        spacing: 3,
      },
    ],
  };

  chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#0F172A',
        titleColor: '#F8FAFC',
        bodyColor: '#F8FAFC',
        padding: 10,
        displayColors: false,
        callbacks: {
          label: (context) => `${context.parsed} KPIs`,
        },
      },
    },
    onClick: (_event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const name = this.distribution[index]?.name;

        if (name) {
          this.toggleSegment(name);
        }
      }
    },
  };

  toggleSegment(name: string): void {
    this.activeSegment =
      this.activeSegment === name ? null : name;

    const dataset = this.chartData.datasets[0];
    if (!dataset) return;

    dataset.backgroundColor = this.distribution.map((item) =>
      this.activeSegment && this.activeSegment !== item.name
        ? `${item.color}59`
        : item.color
    );

    // Update chart rendering after changing segment opacity.
    this.chartData = {
      ...this.chartData,
      datasets: [...this.chartData.datasets],
    };
  }

  getPercentage(value: number): number {
    return this.total > 0
      ? Math.round((value / this.total) * 100)
      : 0;
  }

  trackByName(_index: number, item: { name: string }): string {
    return item.name;
  }
}