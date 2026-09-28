export type HubRole = 'cm' | 'scout' | 'pm';

export type TriageStatus = 'new' | 'feature-request' | 'noise' | 'routed';

export type CorrelationRelation = 'related' | 'not-related' | 'resolved';

export type RequestStatus = 'draft' | 'submitted' | 'decided';

export type DecisionOutcome = 'accept' | 'defer' | 'reject';

export type SocialPost = {
  id: string;
  channel: string;
  authorHandle: string;
  postedAt: string;
  quote: string;
  sentiment: string;
  threadSnippets: string[];
  triageStatus: TriageStatus;
  linkedRequestId: string | null;
  duplicateOfRequestId?: string | null;
  suggestedSignalIds?: string[];
};

export type InternalSignal = {
  id: string;
  type: string;
  windowStart: string;
  windowEnd: string | null;
  resolved: boolean;
  summary: string;
};

export type Correlation = {
  signalId: string | null;
  relation: CorrelationRelation;
  scoutNote: string;
};

export type ProductDecision = {
  outcome: DecisionOutcome;
  fanReason: string;
  decidedAt: string;
};

export type FeatureRequest = {
  id: string;
  postId: string;
  title: string;
  summary: string;
  duplicateHint: string;
  status: RequestStatus;
  submittedAt: string | null;
  correlation: Correlation | null;
  decision: ProductDecision | null;
};

export type TimelineEvent = {
  at: string;
  label: string;
};
