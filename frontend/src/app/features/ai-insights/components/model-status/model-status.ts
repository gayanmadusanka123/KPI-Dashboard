import { ChangeDetectionStrategy, Component } from '@angular/core';
import { models } from '../../data/ai-insights-data';
import { AiProgressBar } from '../ui/progress-bar';

@Component({ selector:'app-model-status', standalone:true, imports:[AiProgressBar], changeDetection:ChangeDetectionStrategy.OnPush, templateUrl:'./model-status.html', styleUrl:'./model-status.css' })
export class ModelStatus { readonly models=models; }
