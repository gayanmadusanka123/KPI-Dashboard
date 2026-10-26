import { Component, input } from '@angular/core';

@Component({
  selector: 'app-widget-container',
  standalone: true,
  templateUrl: './widget-container.html',
  styleUrl: './widget-container.css',
})
export class WidgetContainer {
  title = input.required<string>();
  description = input('');
  editing = input(false);
  
}