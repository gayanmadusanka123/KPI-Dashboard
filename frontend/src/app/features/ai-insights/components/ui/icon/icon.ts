import { afterNextRender, ChangeDetectionStrategy, Component, computed, ElementRef, inject, input } from '@angular/core';
import { ICONS, IconName } from './icons';

@Component({
  selector: 'app-ai-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" [attr.width]="size()" [attr.height]="size()" viewBox="0 0 24 24" fill="none" [attr.stroke]="color()" [attr.stroke-width]="strokeWidth()" stroke-linecap="round" stroke-linejoin="round"></svg>
  `,
  styles: [':host { display:inline-flex; line-height:0; flex-shrink:0; }'],
})
export class AiIcon {
  private readonly element = inject(ElementRef<SVGElement>);
  readonly name = input.required<IconName>();
  readonly size = input<number>(24);
  readonly color = input<string>('currentColor');
  readonly strokeWidth = input<number>(2);
  readonly body = computed(() => ICONS[this.name()] ?? '');

  constructor() {
    afterNextRender(() => {
      this.element.nativeElement.querySelector('svg')?.insertAdjacentHTML('beforeend', this.body());
    });
  }
}
