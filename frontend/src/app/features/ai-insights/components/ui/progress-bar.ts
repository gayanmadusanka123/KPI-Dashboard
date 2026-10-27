import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { C } from '../../data/ai-insights-data';

@Component({ selector:'app-ai-progress', standalone:true, changeDetection:ChangeDetectionStrategy.OnPush, template:`<div class="track" [style.backgroundColor]="border" [style.height.px]="height()"><div class="fill" [style.width.%]="clamped()" [style.backgroundColor]="color()"></div></div>`, styles:[`:host{display:block;width:100%}.track,.fill{border-radius:999px}.fill{height:100%;transition:width .7s ease}`] })
export class AiProgressBar {
  readonly value=input.required<number>(); readonly color=input<string>(C.primary); readonly height=input(6); readonly border=C.border; readonly clamped=computed(()=>Math.min(100,Math.max(0,this.value())));
}
