import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { formatIndex, formatStamp } from './format';
import { HealthBadge } from './health-badge';
import { HubStore } from './hub-store';
import { filterAndRank } from './mock/rank';
import type { Health } from './mock/types';

@Component({
  selector: 'app-portfolio-page',
  imports: [RouterLink, HealthBadge],
  template: `
    <header class="page-head">
      <div>
        <p class="eyebrow">J1 — Morning scan</p>
        <h1>Which 1–3 projects get attention today?</h1>
        <p class="lede">
          Ranked by health, then critical count. Filter, then open a red row — two clicks to
          why.
        </p>
      </div>
      <p class="meta">{{ rows().length }} of {{ store.projects().length }} showing</p>
    </header>

    <form class="filters" aria-label="Portfolio filters">
      <label>
        Region
        <select [value]="region()" (change)="region.set(selectValue($event))">
          <option value="all">All regions</option>
          @for (option of regions; track option) {
            <option [value]="option">{{ option }}</option>
          }
        </select>
      </label>
      <label>
        Business unit
        <select [value]="businessUnit()" (change)="businessUnit.set(selectValue($event))">
          <option value="all">All units</option>
          @for (option of units; track option) {
            <option [value]="option">{{ option }}</option>
          }
        </select>
      </label>
      <label>
        Health
        <select [value]="health()" (change)="setHealth($event)">
          <option value="all">All</option>
          <option value="red">Red</option>
          <option value="amber">Amber</option>
          <option value="green">Green</option>
        </select>
      </label>
    </form>

    <div class="table-wrap">
      <table class="data">
        <caption class="visually-hidden">Portfolio health, ranked</caption>
        <thead>
          <tr>
            <th scope="col">Health</th>
            <th scope="col">Project</th>
            <th scope="col">Region</th>
            <th scope="col">Unit</th>
            <th scope="col">SPI</th>
            <th scope="col">CPI</th>
            <th scope="col">Critical</th>
            <th scope="col">Updated</th>
            <th scope="col"><span class="visually-hidden">Open</span></th>
          </tr>
        </thead>
        <tbody>
          @for (project of rows(); track project.id) {
            <tr [attr.data-health]="project.health">
              <td>
                <app-health-badge [tone]="project.health" [label]="project.health" />
                @if (project.needsSteer) {
                  <span class="flag">Needs steer</span>
                }
              </td>
              <td>
                <a [routerLink]="['/projects', project.id]">{{ project.name }}</a>
              </td>
              <td>{{ project.region }}</td>
              <td>{{ project.businessUnit }}</td>
              <td>{{ formatIndex(project.scheduleIndex) }}</td>
              <td>{{ formatIndex(project.costIndex) }}</td>
              <td>{{ project.criticalIssueCount }}</td>
              <td>{{ formatStamp(project.lastUpdated) }}</td>
              <td>
                <a class="btn btn-small" [routerLink]="['/projects', project.id]">Open</a>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="9" class="empty">No projects match these filters.</td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <p class="hint">
      Cost Lead deep-link (J3):
      <a routerLink="/projects/northridge-hospital/cost">/projects/northridge-hospital/cost</a>
    </p>
  `,
})
export class PortfolioPage {
  readonly store = inject(HubStore);
  readonly formatIndex = formatIndex;
  readonly formatStamp = formatStamp;

  readonly region = signal('all');
  readonly businessUnit = signal('all');
  readonly health = signal<Health | 'all'>('all');

  readonly regions = this.store.uniqueRegions();
  readonly units = this.store.uniqueBusinessUnits();

  readonly rows = computed(() =>
    filterAndRank(this.store.projects(), {
      region: this.region(),
      businessUnit: this.businessUnit(),
      health: this.health(),
    }),
  );

  selectValue(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }

  setHealth(event: Event): void {
    this.health.set(this.selectValue(event) as Health | 'all');
  }
}
