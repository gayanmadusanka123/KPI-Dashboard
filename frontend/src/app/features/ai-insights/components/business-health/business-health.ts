import { ChangeDetectionStrategy, Component } from '@angular/core';
import { C, health } from '../../data/ai-insights-data';
import { AiGaugeRing } from '../ui/gauge-ring';

@Component({ selector:'app-business-health', standalone:true, imports:[AiGaugeRing], changeDetection:ChangeDetectionStrategy.OnPush, templateUrl:'./business-health.html', styleUrl:'./business-health.css' })
export class BusinessHealth { readonly C=C; readonly health=health; }
