import { Component, afterNextRender, ChangeDetectorRef } from '@angular/core';
import { KpiScorecard } from '../../widgets/kpi-scorecard/kpi-scorecard';
import { PerformanceDonut } from '../../widgets/performance-donut/performance-donut';
import { TargetAchievement } from '../../widgets/target-achievement/target-achievement';
import { TopBottomPerformers } from '../../widgets/top-bottom-performers/top-bottom-performers';
import { ForecastOverview } from '../../widgets/forecast-overview/forecast-overview';
import { AtRiskKpis } from '../../widgets/at-risk-kpis/at-risk-kpis';
import { AiInsights } from '../../widgets/ai-insights/ai-insights';
import { DataFreshness } from '../../widgets/data-freshness/data-freshness';

import {
  CompactType,
  DisplayGrid,
  Gridster,
  GridsterConfig,
  GridsterItem,
  GridType,
} from 'angular-gridster2';

import { DashboardWidget } from '../../models/dashboard-layout.models';
import { DashboardLayoutService } from '../../services/dashboard-layout.service';
import { WidgetContainer } from '../widget-container/widget-container';

@Component({
  selector: 'app-gridster-host',
  standalone: true,
  imports: [
    Gridster,
    GridsterItem,
    WidgetContainer,
    KpiScorecard,
    PerformanceDonut,
    TargetAchievement,
    TopBottomPerformers,
    ForecastOverview,
    AtRiskKpis,
    AiInsights,
    DataFreshness
  ],
  templateUrl: './gridster-host.html',
  styleUrl: './gridster-host.css',
})
export class GridsterHost {
  isEditing = false;
  widgets: DashboardWidget[] = [];
  private savedSnapshot: DashboardWidget[] = [];

  options: GridsterConfig = {
   

    gridType: GridType.VerticalFixed,
    fixedRowHeight: 320,
    compactType: CompactType.None,
    margin: 12,
    outerMargin: true,

    minCols: 4,
    maxCols: 4,
    minRows: 1,
    maxRows: 20,

    minItemCols: 1,
    maxItemCols: 4,
    minItemRows: 1,
    maxItemRows: 3,

    pushItems: true,
    swap: false,

    draggable: { enabled: false },
    resizable: { enabled: false },
    displayGrid: DisplayGrid.None,
  };

  constructor(
    private readonly layoutService: DashboardLayoutService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    afterNextRender(() => {
      this.widgets = this.layoutService.loadLayout().widgets;
      this.cdr.detectChanges();
    });
  }

  startEditing(): void {
    this.savedSnapshot = this.cloneWidgets(this.widgets);
    this.isEditing = true;
    this.updateGridOptions(true);
  }

  saveLayout(): void {
    this.layoutService.saveLayout({
      widgets: this.cloneWidgets(this.widgets),
    });

    this.isEditing = false;
    this.updateGridOptions(false);
  }

  cancelEditing(): void {
    this.widgets = this.cloneWidgets(this.savedSnapshot);
    this.isEditing = false;
    this.updateGridOptions(false);
  }

  resetLayout(): void {
    this.widgets = this.layoutService.resetLayout().widgets;
    this.isEditing = false;
    this.updateGridOptions(false);
  }

  private updateGridOptions(enabled: boolean): void {
    this.options = {
      ...this.options,
      draggable: { enabled },
      resizable: { enabled },
      displayGrid: enabled
        ? DisplayGrid.OnDragAndResize
        : DisplayGrid.None,
    };
  }

  private cloneWidgets(
    widgets: DashboardWidget[],
  ): DashboardWidget[] {
    return widgets.map(widget => ({ ...widget }));
  }
}