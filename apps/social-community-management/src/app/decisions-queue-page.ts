import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { formatStamp } from './format';
import { HubStore } from './hub-store';

@Component({
  selector: 'app-decisions-queue-page',
  imports: [RouterLink],
  template: `
    <header class="page-head">
      <div>
        <p class="eyebrow">Product decision queue</p>
        <h1>Review community requests</h1>
      </div>
      <p class="lede">Accept, defer, or reject with a fan-facing reason (mock).</p>
    </header>

    @if (store.role() !== 'pm') {
      <p class="action-box warn">
        Switch role to <strong>Product Manager</strong> to record decisions. You can still preview
        the queue.
      </p>
    }

    @if (store.pendingDecisions().length === 0) {
      <section class="empty-state">
        <h2>Queue is empty</h2>
        <p>No requests awaiting product decision. Submit from a post detail after CM intake and scout correlation.</p>
        <a routerLink="/signals">Go to signals</a>
      </section>
    } @else {
      <table class="data-table">
        <thead>
          <tr>
            <th scope="col">Submitted</th>
            <th scope="col">Title</th>
            <th scope="col">Post</th>
            <th scope="col">Correlation</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          @for (req of store.pendingDecisions(); track req.id) {
            <tr>
              <td>{{ req.submittedAt ? formatStamp(req.submittedAt) : '—' }}</td>
              <td>{{ req.title }}</td>
              <td>{{ req.postId }}</td>
              <td>{{ req.correlation?.relation ?? '—' }}</td>
              <td><a [routerLink]="['/decisions', req.id]">Review</a></td>
            </tr>
          }
        </tbody>
      </table>
    }
  `,
})
export class DecisionsQueuePage {
  readonly store = inject(HubStore);
  readonly formatStamp = formatStamp;
}
