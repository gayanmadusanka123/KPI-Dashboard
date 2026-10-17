import { Component, OnDestroy, OnInit } from '@angular/core';

interface DashboardTask {
  name: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  due: string;
  done: boolean;
}
@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class Dashboard implements OnInit, OnDestroy {
  todayDate = '';
  lastUpdated = 'Live · Updated 2 min ago';

  tasks: DashboardTask[] = [
    { name: 'Q4 Forecast Review', category: 'Finance', priority: 'High', due: 'Today', done: false },
    { name: 'Marketing Budget Approval', category: 'Marketing', priority: 'Medium', due: 'Dec 24', done: false },
    { name: 'HR Satisfaction Survey', category: 'HR', priority: 'Low', due: 'Dec 26', done: true },
    { name: 'Sales Pipeline Audit', category: 'Sales', priority: 'High', due: 'Dec 27', done: false }
  ];

  private seconds = 0;
  private intervalId: ReturnType<typeof setInterval> | undefined;

  ngOnInit(): void {
    this.updateDate();

    this.intervalId = setInterval(() => {
      this.seconds += 5;
      this.lastUpdated = this.seconds < 60
        ? `Live · Updated ${this.seconds}s ago`
        : `Live · Updated ${Math.floor(this.seconds / 60)}m ago`;
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  refresh(): void {
    this.seconds = 0;
    this.lastUpdated = 'Live · Updated 0s ago';
    this.updateDate();
  }

  toggleTask(index: number): void {
    const task = this.tasks[index];
    if (task) {
      task.done = !task.done;
    }
  }

  isTaskDone(index: number): boolean {
    return this.tasks[index]?.done ?? false;
  }

  exportDashboard(): void {
    this.downloadFile(
      'business-performance-dashboard.html',
      this.buildDashboardExport(),
      'text/html;charset=utf-8'
    );
  }

  generatePdf(): void {
    window.print();
  }

  exportExcel(): void {
    const rows = [
      ['Metric', 'Value', 'Change'],
      ['Total Revenue', '$8.4M', '+18.3%'],
      ['Net Profit', '$4.0M', '+31.2%'],
      ['Customer Satisfaction', '94%', '+3.1%'],
      ['Employee Performance', '90%', '+5.9%']
    ];

    const csv = rows
      .map(row => row.map(value => this.escapeCsv(value)).join(','))
      .join('\n');

    this.downloadFile('business-performance-dashboard.csv', csv, 'text/csv;charset=utf-8');
  }

  async shareDashboard(): Promise<void> {
    const shareData = {
      title: 'Business Performance Overview',
      text: 'Business Performance Overview — Health Score 87/100',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled sharing; nothing else is required.
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      window.alert('Dashboard link copied to clipboard.');
    } catch {
      window.alert(`Dashboard URL: ${window.location.href}`);
    }
  }

  downloadReport(): void {
    const report = {
      generatedAt: new Date().toISOString(),
      healthScore: 87,
      predictedRisk: 'Low',
      growthMomentum: 'Strong',
      anomalies: 2,
      revenue: '$8.4M',
      netProfit: '$4.0M',
      customerSatisfaction: '94%',
      employeePerformance: '90%',
      tasks: this.tasks
    };

    this.downloadFile(
      'business-performance-report.json',
      JSON.stringify(report, null, 2),
      'application/json;charset=utf-8'
    );
  }

  openReport(): void {
    this.downloadReport();
  }

  openAnalytics(): void {
    window.alert('Full Analytics is ready to be connected to your analytics route.');
  }

  openForecast(): void {
    window.alert('Full Forecast is ready to be connected to your forecast route.');
  }

  openAllReports(): void {
    window.alert('All Reports is ready to be connected to your reports route.');
  }

  private updateDate(): void {
    this.todayDate = new Date().toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private downloadFile(filename: string, content: string, type: string): void {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = filename;
    anchor.click();

    URL.revokeObjectURL(url);
  }

  private escapeCsv(value: string): string {
    return `"${value.replaceAll('"', '""')}"`;
  }

  private buildDashboardExport(): string {
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Business Performance Overview</title>
<style>
body{font-family:Arial,sans-serif;padding:32px;color:#12151c}h1{margin-bottom:8px}.date{color:#6b7280}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.card{border:1px solid #e2e4ea;border-radius:10px;padding:16px}.value{font-size:24px;font-weight:700;margin-top:8px}
</style>
</head>
<body>
<h1>Business Performance Overview</h1>
<div class="date">${this.todayDate}</div>
<div class="grid">
<div class="card">Total Revenue<div class="value">$8.4M</div></div>
<div class="card">Net Profit<div class="value">$4.0M</div></div>
<div class="card">Customer Satisfaction<div class="value">94%</div></div>
<div class="card">Employee Performance<div class="value">90%</div></div>
</div>
</body>
</html>`;
  }
}
