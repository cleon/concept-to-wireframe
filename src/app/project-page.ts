import { Component, computed, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { formatIndex, formatStamp, formatUsd } from './format';
import { HealthBadge } from './health-badge';
import { domainLabel, HubStore } from './hub-store';
import { isDomain } from './mock/rank';
import { DOMAINS, type Domain, type DriverIssue } from './mock/types';

@Component({
  selector: 'app-project-page',
  imports: [RouterLink, RouterLinkActive, HealthBadge],
  template: `
    @if (project(); as project) {
      <nav class="crumb">
        <a routerLink="/portfolio">← Portfolio</a>
      </nav>

      <header class="page-head">
        <div>
          <p class="eyebrow">{{ project.region }} · {{ project.businessUnit }}</p>
          <h1>{{ project.name }}</h1>
          <p class="lede">{{ project.narrative }}</p>
        </div>
        <app-health-badge [tone]="project.health" [label]="project.health" />
      </header>

      <section class="kpi-strip" aria-label="Project indexes">
        <div>
          <span class="kpi-label">SPI</span>
          <strong>{{ formatIndex(project.scheduleIndex) }}</strong>
        </div>
        <div>
          <span class="kpi-label">CPI</span>
          <strong>{{ formatIndex(project.costIndex) }}</strong>
        </div>
        <div>
          <span class="kpi-label">Critical</span>
          <strong>{{ project.criticalIssueCount }}</strong>
        </div>
        <div>
          <span class="kpi-label">Updated</span>
          <strong>{{ formatStamp(project.lastUpdated) }}</strong>
        </div>
      </section>

      <section class="session-box" aria-label="Needs steer">
        <label class="toggle">
          <input
            type="checkbox"
            [checked]="project.needsSteer"
            (change)="onSteer(project.id, $event)"
          />
          Needs steer
        </label>
        <label class="grow">
          Session note
          <input
            type="text"
            [value]="note()"
            (input)="onNote(project.id, $event)"
            maxlength="160"
            placeholder="Why this is on today’s list"
          />
        </label>
        <p class="hint">Session only — in-app navigation keeps this state; a full refresh reloads fixtures.</p>
      </section>

      @if (costFlag()) {
        <p class="callout" role="status">
          Cost Lead flagged this project for PM follow-up (session only).
        </p>
      }

      <ul class="driver-chips">
        @for (driver of project.drivers; track driver.domain + driver.summary) {
          <li>
            <a [routerLink]="['/projects', project.id, driver.domain]">
              <app-health-badge [tone]="driver.severity" [label]="driver.severity" />
              <span>{{ domainLabel(driver.domain) }} — {{ driver.summary }}</span>
            </a>
          </li>
        } @empty {
          <li class="empty">No active drivers. Empty is intentional — do not treat as missing data.</li>
        }
      </ul>

      <nav class="tabs" aria-label="Project domains">
        <a routerLink="/projects/{{ project.id }}" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }"
          >Overview</a
        >
        @for (item of domains; track item) {
          <a [routerLink]="['/projects', project.id, item]" routerLinkActive="active">{{
            domainLabel(item)
          }}</a>
        }
      </nav>

      @if (!activeDomain()) {
        <section>
          <h2>Top issues to act on</h2>
          <ul class="issue-list">
            @for (issue of topIssues(); track issue.id) {
              <li>
                <a [routerLink]="['/projects', project.id, 'issues', issue.id]">
                  <app-health-badge [tone]="issue.severity" [label]="issue.severity" />
                  <span>
                    <strong>{{ issue.title }}</strong>
                    <em>{{ domainLabel(issue.domain) }} · {{ issue.ownerRole }}</em>
                  </span>
                </a>
              </li>
            } @empty {
              <li class="empty">No open issues. Acknowledge and leave this project off today’s steer list.</li>
            }
          </ul>
        </section>
      } @else if (activeDomain(); as domain) {
        <section>
          <h2>{{ domainLabel(domain) }} — decide from the stub metrics, then open a driver</h2>
          <div class="kpi-strip" aria-label="{{ domainLabel(domain) }} KPIs">
            @for (kpi of domainKpis(); track kpi.label) {
              <div>
                <span class="kpi-label">{{ kpi.label }}</span>
                <strong>{{ kpi.value }}</strong>
              </div>
            }
          </div>

          @if (domain === 'cost') {
            <div class="session-box">
              <label class="toggle">
                <input
                  type="checkbox"
                  [checked]="costFlag()"
                  (change)="onCostFlag(project.id, $event)"
                />
                Flag for PM follow-up
              </label>
              <p class="hint">J3 — Cost Lead review flag. Session only; not written to fixtures.</p>
            </div>
          }

          <ul class="issue-list">
            @for (issue of domainIssues(); track issue.id) {
              <li>
                <a [routerLink]="['/projects', project.id, 'issues', issue.id]">
                  <app-health-badge [tone]="issue.severity" [label]="issue.severity" />
                  <span>
                    <strong>{{ issue.title }}</strong>
                    <em>{{ issue.recommendedAction }}</em>
                  </span>
                </a>
              </li>
            } @empty {
              <li class="empty">
                No open {{ domainLabel(domain) }} issues. Acknowledge and move to another driver.
              </li>
            }
          </ul>
        </section>
      }
    } @else {
      <p class="empty">Unknown project. <a routerLink="/portfolio">Return to portfolio</a>.</p>
    }
  `,
})
export class ProjectPage {
  private readonly store = inject(HubStore);

  readonly id = input.required<string>();
  readonly domain = input<string | undefined>();

  readonly formatIndex = formatIndex;
  readonly formatStamp = formatStamp;
  readonly domainLabel = domainLabel;
  readonly domains = DOMAINS;

  readonly project = computed(() => this.store.project(this.id())());
  readonly note = computed(() => this.store.steerNote(this.id())());
  readonly costFlag = computed(() => this.store.costReviewFlag(this.id())());
  readonly activeDomain = computed(() => {
    const value = this.domain();
    return isDomain(value) ? value : null;
  });
  readonly allIssues = computed(() => this.store.issuesFor(this.id())());
  readonly topIssues = computed(() => this.allIssues().slice(0, 3));
  readonly domainIssues = computed(() => {
    const domain = this.activeDomain();
    if (!domain) {
      return [] as DriverIssue[];
    }
    return this.store.issuesFor(this.id(), domain)();
  });
  readonly domainKpis = computed(() => {
    const project = this.project();
    const domain = this.activeDomain();
    if (!project || !domain) {
      return [];
    }
    const kpis = project.domainKpis;
    if (domain === 'schedule' && kpis.schedule) {
      return [
        { label: 'SPI', value: formatIndex(kpis.schedule.spi) },
        { label: 'Days var', value: String(kpis.schedule.daysVariance) },
        { label: 'Crit. path items', value: String(kpis.schedule.criticalPathItems) },
      ];
    }
    if (domain === 'cost' && kpis.cost) {
      return [
        { label: 'CPI', value: formatIndex(kpis.cost.cpi) },
        { label: 'Contingency drawn', value: `${kpis.cost.contingencyDrawnPct}%` },
        { label: 'EAC variance', value: formatUsd(kpis.cost.eacVarianceUsd) },
      ];
    }
    if (domain === 'safety' && kpis.safety) {
      return [
        { label: 'TRIR (stub)', value: formatIndex(kpis.safety.trir) },
        { label: 'Recordables 14d', value: String(kpis.safety.recordables14d) },
        { label: 'Open actions', value: String(kpis.safety.openActions) },
      ];
    }
    if (domain === 'change' && kpis.change) {
      return [
        { label: 'Open changes', value: String(kpis.change.openCount) },
        { label: 'Pending value', value: formatUsd(kpis.change.pendingValueUsd) },
        { label: 'Avg age (days)', value: String(kpis.change.avgAgeDays) },
      ];
    }
    return [];
  });

  onSteer(projectId: string, event: Event): void {
    this.store.setNeedsSteer(projectId, (event.target as HTMLInputElement).checked);
  }

  onNote(projectId: string, event: Event): void {
    this.store.setSteerNote(projectId, (event.target as HTMLInputElement).value);
  }

  onCostFlag(projectId: string, event: Event): void {
    this.store.setCostReviewFlag(projectId, (event.target as HTMLInputElement).checked);
  }
}
