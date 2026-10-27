import {
  Component,
  afterNextRender,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';

import { GridHostDirective } from './grid-host.directive';

@Component({
  selector: 'app-dashboard-grid',
  standalone: true,
  imports: [GridHostDirective],
  templateUrl: './dashboard-grid.html',
  styleUrl: './dashboard-grid.css',
})
export class DashboardGrid {
  @ViewChild(GridHostDirective)
  private gridHost?: GridHostDirective;

  constructor(
    private readonly cdr: ChangeDetectorRef
  ) {
    afterNextRender(() => {
      void this.loadGridster();
    });
  }

  private async loadGridster(): Promise<void> {
    if (!this.gridHost) {
      return;
    }

    const { GridsterHost } = await import(
      '../gridster-host/gridster-host'
    );

    // Avoid duplicate instances if loading is triggered more than once.
    this.gridHost.viewContainer.clear();
    this.gridHost.viewContainer.createComponent(GridsterHost);
    this.cdr.detectChanges();
  }
}