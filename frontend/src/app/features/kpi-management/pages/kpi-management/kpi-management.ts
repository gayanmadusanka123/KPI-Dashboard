import { Component } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';

import { AddKpiDialog } from '../../components/add-kpi-dialog/add-kpi-dialog';

@Component({
  selector: 'app-kpi-management',
  imports: [],
  templateUrl: './kpi-management.html',
  styleUrl: './kpi-management.css',
})
export class KpiManagement {
  constructor(private dialog: MatDialog) {}

  openAddKpiDialog() {
    this.dialog.open(AddKpiDialog, {
      width: '800px',
      disableClose: true
    });
  }
}
