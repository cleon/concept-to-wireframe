import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { formatStamp } from './format';
import { HubStore } from './hub-store';
import type { CorrelationRelation } from './mock/types';

@Component({
  selector: 'app-post-detail-page',
  imports: [RouterLink, FormsModule],
  template: `
    @if (post(); as post) {
      <nav class="crumb">
        <a routerLink="/signals">← Back to signals</a>
      </nav>

      <header class="page-head">
        <div>
          <p class="eyebrow">{{ post.channel }} · {{ post.authorHandle }}</p>
          <h1>Post detail</h1>
        </div>
        <span class="pill">{{ post.sentiment }}</span>
      </header>

      <blockquote class="quote">{{ post.quote }}</blockquote>
      <p class="lede">Posted {{ formatStamp(post.postedAt) }}</p>

      @if (post.threadSnippets.length) {
        <section>
          <h2>Related thread (mock)</h2>
          <ul class="thread-list">
            @for (snippet of post.threadSnippets; track snippet) {
              <li>{{ snippet }}</li>
            }
          </ul>
        </section>
      }

      @if (post.duplicateOfRequestId) {
        <section class="action-box warn">
          <h2>Duplicate / already routed</h2>
          <p>
            This post is linked to an existing request
            <a [routerLink]="['/decisions', post.duplicateOfRequestId]">{{
              post.duplicateOfRequestId
            }}</a
            >. Do not submit a second packet unless product splits the ask.
          </p>
        </section>
      }

      @if (store.role() === 'cm') {
        <section class="action-box">
          <h2>CM triage</h2>
          <div class="btn-row">
            <button type="button" (click)="markFeature()">Mark feature request</button>
            <button type="button" class="secondary" (click)="dismissNoise()">
              Dismiss as noise
            </button>
          </div>
          @if (post.triageStatus === 'noise') {
            <p class="hint">Dismissed for this session — find it under Dismissed (noise) on the list.</p>
          }
        </section>

        @if (post.triageStatus === 'feature-request' || post.triageStatus === 'routed') {
          <section>
            <h2>Intake (mock)</h2>
            <label>
              Title
              <input type="text" [(ngModel)]="title" name="title" required />
            </label>
            <label>
              Summary
              <textarea [(ngModel)]="summary" name="summary" rows="3" required></textarea>
            </label>
            <label>
              Duplicate check hint
              <input type="text" [(ngModel)]="duplicateHint" name="dup" />
            </label>
            <button type="button" (click)="saveDraft()">Save intake draft</button>
            @if (draftSaved()) {
              <p class="hint">Draft saved in session.</p>
            }
          </section>
        }
      }

      @if (store.role() === 'scout' || store.role() === 'cm') {
        <section>
          <h2>Backend correlation (Scout / DevOps)</h2>
          @if (store.role() === 'cm') {
            <p class="hint">Switch role to Infrastructure scout to edit correlation.</p>
          }
          @if (suggested().length) {
            <p class="hint">Suggested signals for this post (may conflict):</p>
            <ul class="thread-list">
              @for (sig of suggested(); track sig.id) {
                <li>
                  <strong>{{ sig.type }}</strong> — {{ sig.summary }}
                  @if (sig.resolved) {
                    (resolved)
                  } @else {
                    (ongoing)
                  }
                </li>
              }
            </ul>
          } @else {
            <p class="empty">No suggested internal signals for this post.</p>
          }

          @if (store.role() === 'scout') {
            <label>
              Link internal signal
              <select [(ngModel)]="signalId" name="signal">
                <option value="">— None —</option>
                @for (sig of store.signals(); track sig.id) {
                  <option [value]="sig.id">{{ sig.id }} — {{ sig.summary }}</option>
                }
              </select>
            </label>
            <fieldset>
              <legend>Relation</legend>
              @for (rel of relations; track rel) {
                <label class="inline">
                  <input type="radio" [(ngModel)]="relation" [value]="rel" name="relation" />
                  {{ rel }}
                </label>
              }
            </fieldset>
            <label>
              Scout note
              <textarea [(ngModel)]="scoutNote" name="scoutNote" rows="2"></textarea>
            </label>
            <button type="button" (click)="saveCorrelation()">Save correlation</button>
          }

          @if (activeRequest()?.correlation; as corr) {
            <p class="hint">
              Saved: {{ corr.relation }}
              @if (corr.signalId) {
                · {{ corr.signalId }}
              }
              — {{ corr.scoutNote }}
            </p>
          }
        </section>
      }

      @if (store.role() === 'cm' || store.role() === 'scout') {
        <section class="action-box">
          <h2>Submit to product</h2>
          <button type="button" (click)="submit()">Submit enriched request</button>
          @if (submitMessage()) {
            <p [class]="submitOk() ? 'hint' : 'error'">{{ submitMessage() }}</p>
          }
          @if (activeRequest()?.status === 'submitted') {
            <p>
              Submitted —
              <a [routerLink]="['/decisions', activeRequest()!.id]">Open in decision queue</a>
            </p>
          }
        </section>
      }
    } @else {
      <p class="empty">Unknown post. <a routerLink="/signals">Return to signals</a>.</p>
    }
  `,
})
export class PostDetailPage {
  readonly store = inject(HubStore);
  readonly id = input.required<string>();
  readonly formatStamp = formatStamp;

  readonly relations: CorrelationRelation[] = ['related', 'not-related', 'resolved'];

  title = '';
  summary = '';
  duplicateHint = '';
  signalId = '';
  relation: CorrelationRelation = 'not-related';
  scoutNote = '';

  readonly draftSaved = signal(false);
  readonly submitMessage = signal('');
  readonly submitOk = signal(false);

  readonly post = computed(() => this.store.post(this.id())());
  readonly suggested = computed(() => this.store.suggestedSignals(this.id())());
  readonly activeRequest = computed(() => this.store.requestForPost(this.id())());

  markFeature(): void {
    this.store.setTriage(this.id(), 'feature-request');
  }

  dismissNoise(): void {
    this.store.dismissAsNoise(this.id());
  }

  saveDraft(): void {
    const reqId = this.store.saveIntake(this.id(), {
      title: this.title,
      summary: this.summary,
      duplicateHint: this.duplicateHint,
    });
    this.draftSaved.set(true);
    void reqId;
  }

  saveCorrelation(): void {
    const req = this.activeRequest();
    let requestId = req?.id;
    if (!requestId) {
      requestId = this.store.saveIntake(this.id(), {
        title: this.title || 'Untitled intake',
        summary: this.summary || 'Pending CM summary',
        duplicateHint: this.duplicateHint,
      });
      this.store.setTriage(this.id(), 'feature-request');
    }
    this.store.saveCorrelation(requestId, {
      signalId: this.signalId || null,
      relation: this.relation,
      scoutNote: this.scoutNote || 'EXAMPLE — No note provided.',
    });
  }

  submit(): void {
    let req = this.activeRequest();
    if (!req) {
      const requestId = this.store.saveIntake(this.id(), {
        title: this.title,
        summary: this.summary,
        duplicateHint: this.duplicateHint,
      });
      req = this.store.request(requestId)();
    }
    if (!req) {
      this.submitOk.set(false);
      this.submitMessage.set('Save intake and correlation first.');
      return;
    }
    const result = this.store.submitRequest(req.id);
    this.submitOk.set(result.ok);
    this.submitMessage.set(result.message ?? (result.ok ? 'Submitted to product queue.' : 'Submit failed.'));
  }
}
