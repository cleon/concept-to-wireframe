import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { formatStamp } from './format';
import { HubStore, type SignalListFilter } from './hub-store';

@Component({
  selector: 'app-signals-list-page',
  imports: [RouterLink],
  template: `
    <header class="page-head">
      <div>
        <p class="eyebrow">Community signals</p>
        <h1>Triage social posts</h1>
      </div>
      <p class="lede">Open a post to classify, enrich, and route a feature request (mock).</p>
    </header>

    <section class="kpi-strip" aria-label="Filters">
      @for (option of filters; track option.id) {
        <button
          type="button"
          class="kpi"
          [class.active]="store.listFilter() === option.id"
          (click)="store.setListFilter(option.id)"
        >
          {{ option.label }}
        </button>
      }
    </section>

    <section>
      <h2 class="visually-hidden">Post list</h2>
      <table class="data-table">
        <thead>
          <tr>
            <th scope="col">Posted</th>
            <th scope="col">Channel</th>
            <th scope="col">Sentiment</th>
            <th scope="col">Quote</th>
            <th scope="col">Status</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          @for (post of store.filteredPosts()(); track post.id) {
            <tr>
              <td>{{ formatStamp(post.postedAt) }}</td>
              <td>{{ post.channel }}</td>
              <td>{{ post.sentiment }}</td>
              <td class="clip">{{ post.quote }}</td>
              <td>{{ statusLabel(post.triageStatus) }}</td>
              <td>
                <a [routerLink]="['/posts', post.id]">Open post</a>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="6" class="empty">
                @if (store.listFilter() === 'dismissed-noise') {
                  No dismissed posts in this session.
                } @else if (store.listFilter() === 'needs-attention') {
                  No posts need attention with the current filter.
                } @else {
                  No posts in the mock feed.
                }
              </td>
            </tr>
          }
        </tbody>
      </table>
    </section>
  `,
})
export class SignalsListPage {
  readonly store = inject(HubStore);
  readonly formatStamp = formatStamp;

  readonly filters: { id: SignalListFilter; label: string }[] = [
    { id: 'needs-attention', label: 'Needs attention' },
    { id: 'all', label: 'All posts' },
    { id: 'dismissed-noise', label: 'Dismissed (noise)' },
  ];

  statusLabel(status: string): string {
    switch (status) {
      case 'new':
        return 'New';
      case 'feature-request':
        return 'Feature request';
      case 'noise':
        return 'Noise';
      case 'routed':
        return 'Routed';
      default:
        return status;
    }
  }
}
