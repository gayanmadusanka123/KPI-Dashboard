import { GridsterItemConfig } from 'angular-gridster2';

export interface DashboardWidget extends GridsterItemConfig {
  id: string;
  title: string;
  description: string;
}

export interface DashboardLayout {
  widgets: DashboardWidget[];
}