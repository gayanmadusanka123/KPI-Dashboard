import { Component } from '@angular/core';
import { DashboardGrid } from '../../components/dashboard-grid/dashboard-grid';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardGrid],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}
