import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BadgeVariant, C, insights } from '../../data/ai-insights-data';
import { AiBadge } from '../ui/badge';
import { AiIcon } from '../ui/icon/icon';

@Component({ selector:'app-insight-feed', standalone:true, imports:[AiIcon,AiBadge], changeDetection:ChangeDetectionStrategy.OnPush, templateUrl:'./insight-feed.html', styleUrl:'./insight-feed.css' })
export class InsightFeed {
 readonly C=C; readonly insights=insights; readonly activeSignal=signal(0); readonly filters=['All','Opportunities','Risks','Anomalies'];
 readonly typeV:Record<string,BadgeVariant>={opportunity:'success',risk:'warning',anomaly:'ai'};
 readonly impactV:Record<string,BadgeVariant>={High:'danger',Medium:'warning',Low:'default'};
}
