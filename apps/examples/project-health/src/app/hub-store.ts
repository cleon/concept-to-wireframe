import { computed, Injectable, signal } from '@angular/core';

import issuesFixture from '../assets/mock/issues.json';
import projectsFixture from '../assets/mock/projects.json';
import { isDomain } from './mock/rank';
import type { Domain, DriverIssue, ProjectDetail } from './mock/types';

@Injectable({ providedIn: 'root' })
export class HubStore {
  private readonly projectsState = signal<ProjectDetail[]>(
    structuredClone(projectsFixture) as ProjectDetail[],
  );
  private readonly issuesState = signal<DriverIssue[]>(
    structuredClone(issuesFixture) as DriverIssue[],
  );
  private readonly costReviewFlags = signal<Record<string, boolean>>({});
  private readonly steerNotes = signal<Record<string, string>>({});

  readonly projects = this.projectsState.asReadonly();
  readonly issues = this.issuesState.asReadonly();

  project(id: string) {
    return computed(() => this.projectsState().find((item) => item.id === id) ?? null);
  }

  issuesFor(projectId: string, domain?: string) {
    return computed(() =>
      this.issuesState().filter((issue) => {
        if (issue.projectId !== projectId) {
          return false;
        }
        return !domain || !isDomain(domain) || issue.domain === domain;
      }),
    );
  }

  issue(projectId: string, issueId: string) {
    return computed(
      () =>
        this.issuesState().find(
          (item) => item.projectId === projectId && item.id === issueId,
        ) ?? null,
    );
  }

  costReviewFlag(projectId: string) {
    return computed(() => Boolean(this.costReviewFlags()[projectId]));
  }

  steerNote(projectId: string) {
    return computed(() => this.steerNotes()[projectId] ?? '');
  }

  setNeedsSteer(projectId: string, value: boolean): void {
    this.projectsState.update((list) =>
      list.map((project) =>
        project.id === projectId ? { ...project, needsSteer: value } : project,
      ),
    );
  }

  setSteerNote(projectId: string, note: string): void {
    this.steerNotes.update((current) => ({ ...current, [projectId]: note }));
  }

  setCostReviewFlag(projectId: string, value: boolean): void {
    this.costReviewFlags.update((current) => ({ ...current, [projectId]: value }));
  }

  uniqueRegions(): string[] {
    return uniqueSorted(this.projectsState().map((project) => project.region));
  }

  uniqueBusinessUnits(): string[] {
    return uniqueSorted(this.projectsState().map((project) => project.businessUnit));
  }
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export function domainLabel(domain: Domain): string {
  switch (domain) {
    case 'schedule':
      return 'Schedule';
    case 'cost':
      return 'Cost';
    case 'safety':
      return 'Safety';
    case 'change':
      return 'Change';
  }
}
