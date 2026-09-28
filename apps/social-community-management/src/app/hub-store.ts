import { computed, Injectable, signal } from '@angular/core';

import postsFixture from '../assets/mock/posts.json';
import signalsFixture from '../assets/mock/internal-signals.json';
import requestsFixture from '../assets/mock/requests.json';
import type {
  CorrelationRelation,
  DecisionOutcome,
  FeatureRequest,
  HubRole,
  InternalSignal,
  SocialPost,
  TimelineEvent,
  TriageStatus,
} from './mock/types';

export type SignalListFilter = 'all' | 'needs-attention' | 'dismissed-noise';

@Injectable({ providedIn: 'root' })
export class HubStore {
  private readonly postsState = signal<SocialPost[]>(
    structuredClone(postsFixture) as SocialPost[],
  );
  private readonly signalsState = signal<InternalSignal[]>(
    structuredClone(signalsFixture) as InternalSignal[],
  );
  private readonly requestsState = signal<FeatureRequest[]>(
    structuredClone(requestsFixture) as FeatureRequest[],
  );

  readonly role = signal<HubRole>('cm');
  readonly listFilter = signal<SignalListFilter>('needs-attention');
  readonly dismissedPostIds = signal<Set<string>>(new Set());

  readonly posts = this.postsState.asReadonly();
  readonly signals = this.signalsState.asReadonly();
  readonly requests = this.requestsState.asReadonly();

  readonly pendingDecisions = computed(() =>
    this.requestsState().filter((r) => r.status === 'submitted'),
  );

  setRole(role: HubRole): void {
    this.role.set(role);
  }

  setListFilter(filter: SignalListFilter): void {
    this.listFilter.set(filter);
  }

  post(id: string) {
    return computed(() => this.postsState().find((p) => p.id === id) ?? null);
  }

  request(id: string) {
    return computed(() => this.requestsState().find((r) => r.id === id) ?? null);
  }

  requestForPost(postId: string) {
    return computed(() => {
      const post = this.postsState().find((p) => p.id === postId);
      if (!post?.linkedRequestId) {
        return (
          this.requestsState().find(
            (r) => r.postId === postId && (r.status === 'draft' || r.status === 'submitted'),
          ) ?? null
        );
      }
      return this.requestsState().find((r) => r.id === post.linkedRequestId) ?? null;
    });
  }

  filteredPosts() {
    return computed(() => {
      const dismissed = this.dismissedPostIds();
      const filter = this.listFilter();
      return this.postsState().filter((post) => {
        const isDismissed = dismissed.has(post.id) || post.triageStatus === 'noise';
        if (filter === 'dismissed-noise') {
          return isDismissed;
        }
        if (filter === 'needs-attention') {
          return !isDismissed && post.triageStatus !== 'routed';
        }
        return true;
      });
    });
  }

  suggestedSignals(postId: string) {
    return computed(() => {
      const post = this.postsState().find((p) => p.id === postId);
      const ids = post?.suggestedSignalIds ?? [];
      if (ids.length === 0) {
        return [];
      }
      return this.signalsState().filter((s) => ids.includes(s.id));
    });
  }

  setTriage(postId: string, status: TriageStatus): void {
    this.postsState.update((list) =>
      list.map((p) => (p.id === postId ? { ...p, triageStatus: status } : p)),
    );
  }

  dismissAsNoise(postId: string): void {
    this.dismissedPostIds.update((set) => new Set(set).add(postId));
    this.setTriage(postId, 'noise');
  }

  saveIntake(
    postId: string,
    draft: { title: string; summary: string; duplicateHint: string },
  ): string {
    const existing = this.requestsState().find(
      (r) => r.postId === postId && r.status === 'draft',
    );
    if (existing) {
      this.requestsState.update((list) =>
        list.map((r) =>
          r.id === existing.id
            ? {
                ...r,
                title: draft.title,
                summary: draft.summary,
                duplicateHint: draft.duplicateHint,
              }
            : r,
        ),
      );
      return existing.id;
    }
    const id = `req-draft-${postId}`;
    const request: FeatureRequest = {
      id,
      postId,
      title: draft.title,
      summary: draft.summary,
      duplicateHint: draft.duplicateHint,
      status: 'draft',
      submittedAt: null,
      correlation: null,
      decision: null,
    };
    this.requestsState.update((list) => [...list, request]);
    return id;
  }

  saveCorrelation(
    requestId: string,
    payload: {
      signalId: string | null;
      relation: CorrelationRelation;
      scoutNote: string;
    },
  ): void {
    this.requestsState.update((list) =>
      list.map((r) =>
        r.id === requestId
          ? {
              ...r,
              correlation: {
                signalId: payload.signalId,
                relation: payload.relation,
                scoutNote: payload.scoutNote,
              },
            }
          : r,
      ),
    );
  }

  submitRequest(requestId: string): { ok: boolean; message?: string } {
    const request = this.requestsState().find((r) => r.id === requestId);
    if (!request) {
      return { ok: false, message: 'Request not found.' };
    }
    const post = this.postsState().find((p) => p.id === request.postId);
    if (post?.duplicateOfRequestId && post.duplicateOfRequestId !== requestId) {
      return {
        ok: false,
        message: 'This post is flagged as a duplicate of an open request.',
      };
    }
    if (!request.title.trim() || !request.summary.trim()) {
      return { ok: false, message: 'Title and summary are required before submit.' };
    }
    if (!request.correlation) {
      return {
        ok: false,
        message: 'Scout correlation must be recorded before submit (switch to Scout role).',
      };
    }

    const submittedAt = new Date().toISOString();
    this.requestsState.update((list) =>
      list.map((r) =>
        r.id === requestId ? { ...r, status: 'submitted' as const, submittedAt } : r,
      ),
    );
    this.postsState.update((list) =>
      list.map((p) =>
        p.id === request.postId
          ? { ...p, triageStatus: 'routed' as const, linkedRequestId: requestId }
          : p,
      ),
    );
    return { ok: true };
  }

  recordDecision(
    requestId: string,
    outcome: DecisionOutcome,
    fanReason: string,
  ): { ok: boolean; message?: string } {
    if (!fanReason.trim()) {
      return { ok: false, message: 'Fan-facing reason is required.' };
    }
    const decidedAt = new Date().toISOString();
    this.requestsState.update((list) =>
      list.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'decided' as const,
              decision: { outcome, fanReason, decidedAt },
            }
          : r,
      ),
    );
    return { ok: true };
  }

  timelineForRequest(requestId: string): TimelineEvent[] {
    const request = this.requestsState().find((r) => r.id === requestId);
    if (!request) {
      return [];
    }
    const post = this.postsState().find((p) => p.id === request.postId);
    const events: TimelineEvent[] = [];
    if (post) {
      events.push({
        at: post.postedAt,
        label: `Social signal captured (${post.channel}) — ${post.authorHandle}`,
      });
    }
    if (request.submittedAt) {
      events.push({ at: request.submittedAt, label: 'Request submitted to product queue' });
    }
    if (request.correlation) {
      const signal = request.correlation.signalId
        ? this.signalsState().find((s) => s.id === request.correlation!.signalId)
        : null;
      events.push({
        at: request.submittedAt ?? post?.postedAt ?? new Date().toISOString(),
        label: signal
          ? `Scout correlation: ${request.correlation.relation} — ${signal.summary}`
          : `Scout correlation: ${request.correlation.relation} — ${request.correlation.scoutNote}`,
      });
    }
    if (request.decision) {
      events.push({
        at: request.decision.decidedAt,
        label: `Product decision: ${request.decision.outcome} — "${request.decision.fanReason}"`,
      });
    }
    return events;
  }
}

export function roleLabel(role: HubRole): string {
  switch (role) {
    case 'cm':
      return 'Community Manager';
    case 'scout':
      return 'Infrastructure scout';
    case 'pm':
      return 'Product Manager';
  }
}

export function outcomeLabel(outcome: DecisionOutcome): string {
  switch (outcome) {
    case 'accept':
      return 'Accept';
    case 'defer':
      return 'Defer';
    case 'reject':
      return 'Reject';
  }
}
