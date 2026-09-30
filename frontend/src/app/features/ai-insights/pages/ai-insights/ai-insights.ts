import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ModelStatus } from '../../components/model-status/model-status';
import { InsightFeed } from '../../components/insight-feed/insight-feed';
import { ActionQueue } from '../../components/action-queue/action-queue';
import { BusinessHealth } from '../../components/business-health/business-health';
import { C } from '../../data/ai-insights-data';

@Component({
  selector: 'app-ai-insights',
  standalone: true,
  imports: [ModelStatus, InsightFeed, ActionQueue, BusinessHealth],
  templateUrl: './ai-insights.html',
  styleUrl: './ai-insights.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiInsights {
  readonly C = C;
}
