import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    RouterOutlet,
    Header,
    Sidebar,
    Footer    
  ],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {
  collapsed = false;

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }
}
