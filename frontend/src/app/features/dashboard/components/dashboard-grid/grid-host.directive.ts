import { Directive, ViewContainerRef, inject } from '@angular/core';

@Directive({
  selector: '[appGridHost]',
  standalone: true,
})
export class GridHostDirective {
  readonly viewContainer = inject(ViewContainerRef);
}