import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { formatStamp } from './format';
import { HubStore, outcomeLabel } from './hub-store';
import type { DecisionOutcome } from './mock/types';

@Component({
  selector: 'app-decision-detail-page',
  imports: [RouterLink, FormsModule],
  template: `
    @if (request(); as request) {
      <nav class="crumb">
        <a routerLink="/decisions">← Back to decision queue</a>
      </nav>

      <header class="page-head">
        <div>
          <p class="eyebrow">Request {{ request.id }}</p>
          <h1>{{ request.title }}</h1>
        </div>
        @if (request.status === 'decided' && request.decision) {
          <span class="pill">{{ outcomeLabel(request.decision.outcome) }}</span>
        }
      </header>

      <p class="lede">{{ request.summary }}</p>
      <p class="hint">Source post: <a [routerLink]="['/posts', request.postId]">{{ request.postId }}</a></p>

      @if (post(); as post) {
        <section>
          <h2>Evidence — social</h2>
          <blockquote class="quote">{{ post.quote }}</blockquote>
        </section>
      }

      @if (request.correlation) {
        <section>
          <h2>Evidence — internal correlation</h2>
          <p>
            <strong>{{ request.correlation.relation }}</strong>
            @if (request.correlation.signalId) {
              · {{ request.correlation.signalId }}
            }
          </p>
          <p>{{ request.correlation.scoutNote }}</p>
          @if (conflictHint()) {
            <p class="action-box warn">{{ conflictHint() }}</p>
          }
        </section>
      }

      @if (request.status === 'submitted' && store.role() === 'pm') {
        <section class="action-box">
          <h2>Product decision</h2>
          <fieldset>
            <legend>Outcome</legend>
            @for (outcome of outcomes; track outcome) {
              <label class="inline">
                <input type="radio" [(ngModel)]="selectedOutcome" [value]="outcome" name="outcome" />
                {{ outcomeLabel(outcome) }}
              </label>
            }
          </fieldset>
          <label>
            Fan-facing reason (mock)
            <textarea [(ngModel)]="fanReason" name="fanReason" rows="3" required></textarea>
          </label>
          <button type="button" (click)="decide()">Record decision</button>
          @if (error()) {
            <p class="error">{{ error() }}</p>
          }
        </section>
      } @else if (request.status === 'submitted') {
        <p class="hint">Switch to Product Manager role to record a decision.</p>
      }

      @if (request.decision) {
        <section>
          <h2>Closed — fan-facing reason</h2>
          <p>{{ request.decision.fanReason }}</p>
        </section>
      }

      <section>
        <h2>Evidence timeline (mock)</h2>
        <ol class="timeline">
          @for (event of timeline(); track event.at + event.label) {
            <li>
              <time [attr.datetime]="event.at">{{ formatStamp(event.at) }}</time>
              <span>{{ event.label }}</span>
            </li>
          }
        </ol>
      </section>
    } @else {
      <p class="empty">Unknown request. <a routerLink="/decisions">Return to queue</a>.</p>
    }
  `,
})
export class DecisionDetailPage {
  readonly store = inject(HubStore);
  readonly id = input.required<string>();
  readonly formatStamp = formatStamp;
  readonly outcomeLabel = outcomeLabel;

  readonly outcomes: DecisionOutcome[] = ['accept', 'defer', 'reject'];
  selectedOutcome: DecisionOutcome = 'defer';
  fanReason = '';
  readonly error = signal('');

  readonly request = computed(() => this.store.request(this.id())());
  readonly post = computed(() => {
    const req = this.request();
    return req ? this.store.post(req.postId)() : null;
  });

  readonly timeline = computed(() => this.store.timelineForRequest(this.id()));

  readonly conflictHint = computed(() => {
    const req = this.request();
    const post = this.post();
    if (!req?.correlation || !post?.suggestedSignalIds?.length) {
      return '';
    }
    const hasResolved = post.suggestedSignalIds.some((id) => id.includes('resolved'));
    const hasOngoing = post.suggestedSignalIds.some((id) => id.includes('ongoing'));
    if (hasResolved && hasOngoing) {
      return 'Conflicting signals: downtime was marked resolved while fan reports continue. PM should defer or accept with explicit comms.';
    }
    return '';
  });

  decide(): void {
    const result = this.store.recordDecision(this.id(), this.selectedOutcome, this.fanReason);
    if (!result.ok) {
      this.error.set(result.message ?? 'Could not save.');
      return;
    }
    this.error.set('');
  }
}
