import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { C } from '../../data/ai-insights-data';

@Component({ selector:'app-ai-gauge-ring', standalone:true, changeDetection:ChangeDetectionStrategy.OnPush, template:`<svg [attr.width]="size()" [attr.height]="size()" [attr.viewBox]="'0 0 '+size()+' '+size()" class="gauge"><circle [attr.cx]="cx()" [attr.cy]="cx()" [attr.r]="r()" fill="none" [attr.stroke]="border" [attr.stroke-width]="stroke()"/><circle [attr.cx]="cx()" [attr.cy]="cx()" [attr.r]="r()" fill="none" [attr.stroke]="color()" [attr.stroke-width]="stroke()" stroke-linecap="round" [attr.stroke-dasharray]="dash()"/></svg>`, styles:[`:host{display:inline-flex}.gauge{transform:rotate(-90deg)}`] })
export class AiGaugeRing {
 readonly value=input.required<number>(); readonly max=input(100); readonly size=input(120); readonly stroke=input(9); readonly color=input.required<string>(); readonly border=C.border;
 readonly r=computed(()=> (this.size()-this.stroke()*2)/2); readonly cx=computed(()=>this.size()/2); readonly circ=computed(()=>2*Math.PI*this.r()); readonly dash=computed(()=>
  `${(this.value()/this.max())*this.circ()} ${this.circ()}`);
}
