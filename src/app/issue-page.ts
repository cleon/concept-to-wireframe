import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { formatStamp } from './format';
import { HealthBadge } from './health-badge';
import { domainLabel, HubStore } from './hub-store';

@Component({
  selector: 'app-issue-page',
  imports: [RouterLink, HealthBadge],
  template: `
    @if (issue(); as issue) {
      <nav class="crumb">
        <a [routerLink]="backLink()">← Back to project</a>
      </nav>
      <p class="eyebrow">{{ domainLabel(issue.domain) }} driver</p>
      <header class="page-head">
        <h1>{{ issue.title }}</h1>
        <app-health-badge [tone]="issue.severity" [label]="issue.severity" />
      </header>
      <p class="lede">{{ issue.ownerRole }} · Updated {{ formatStamp(issue.updatedAt) }}</p>

      <section class="action-box">
        <h2>Recommended next action</h2>
        <p>{{ issue.recommendedAction }}</p>
      </section>

      <section>
        <h2>Stub timeline</h2>
        <ol class="timeline">
          @for (event of issue.timeline; track event.at + event.label) {
            <li>
              <time [attr.datetime]="event.at">{{ formatStamp(event.at) }}</time>
              <span>{{ event.label }}</span>
            </li>
          } @empty {
            <li class="empty">No timeline events in the fixture.</li>
          }
        </ol>
      </section>
    } @else {
      <p class="empty">Unknown driver. <a routerLink="/portfolio">Return to portfolio</a>.</p>
    }
  `,
})
export class IssuePage {
  private readonly store = inject(HubStore);

  readonly id = input.required<string>();
  readonly issueId = input.required<string>();

  readonly formatStamp = formatStamp;
  readonly domainLabel = domainLabel;

  readonly issue = computed(() => this.store.issue(this.id(), this.issueId())());
  readonly backLink = computed(() => {
    const issue = this.issue();
    return issue ? ['/projects', this.id(), issue.domain] : ['/projects', this.id()];
  });
}
