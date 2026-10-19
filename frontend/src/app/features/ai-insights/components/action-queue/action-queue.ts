import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { actions, C } from '../../data/ai-insights-data';
import { AiBadge } from '../ui/badge';
import { AiIcon } from '../ui/icon/icon';

@Component({ selector:'app-action-queue', standalone:true, imports:[AiBadge,AiIcon], changeDetection:ChangeDetectionStrategy.OnPush, templateUrl:'./action-queue.html', styleUrl:'./action-queue.css' })
export class ActionQueue { readonly C=C; readonly actions=actions; readonly openActions=computed(()=>this.actions.filter(a=>!a.done).length); }
