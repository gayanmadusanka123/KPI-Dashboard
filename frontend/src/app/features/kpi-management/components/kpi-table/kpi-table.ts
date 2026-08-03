import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';



export interface Kpi {
  id: string;
  name: string;
  category: string;
  dept: string;
  owner: string;
  frequency: string;
  target: string;
  actual: string;
  score: number;
  status: 'Exceeded' | 'On Track' | 'At Risk' | 'Off Track';
  trend: 'up' | 'down' | 'flat';
  updated: string;
}

@Component({
  selector: 'app-kpi-table',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './kpi-table.html',
  styleUrl: './kpi-table.css'
})


export class KpiTable implements OnChanges {

  @Input() kpis: Kpi[] = [];

  filteredKpis: Kpi[] = [];

  searchText = '';

  selectedCategory = '';
  selectedDepartment = '';
  selectedStatus = '';
  selectedKpi: Kpi | null = null;
  viewMode: 'table' | 'cards' = 'table';


  sortColumn = '';
  sortAsc = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['kpis']) {
      this.filteredKpis = [...this.kpis];
    }
  }

  filterKpis(): void {

    this.filteredKpis = this.kpis.filter(kpi => {

      const matchesSearch =
        kpi.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        kpi.id.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesCategory =
        !this.selectedCategory ||
        kpi.category === this.selectedCategory;

      const matchesDepartment =
        !this.selectedDepartment ||
        kpi.dept === this.selectedDepartment;

      const matchesStatus =
        !this.selectedStatus ||
        kpi.status === this.selectedStatus;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDepartment &&
        matchesStatus
      );

    });

  }

  sort(column: keyof Kpi): void {

    if (this.sortColumn === column) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortColumn = column;
      this.sortAsc = true;
    }

    this.filteredKpis.sort((a: any, b: any) => {

      const valueA = a[column];
      const valueB = b[column];

      if (valueA < valueB) {
        return this.sortAsc ? -1 : 1;
      }

      if (valueA > valueB) {
        return this.sortAsc ? 1 : -1;
      }

      return 0;

    });

  }

  // openActions(kpi: Kpi): void {
  //   console.log('Actions:', kpi);
  // }

  viewKpi(kpi: Kpi): void {
    console.log('View', kpi);
  }

  editKpi(kpi: Kpi): void {
    console.log('Edit', kpi);
  }

  deleteKpi(kpi: Kpi): void {
    console.log('Delete', kpi);
  }

}