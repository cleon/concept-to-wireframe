export type Health = 'red' | 'amber' | 'green';
export type Domain = 'schedule' | 'cost' | 'safety' | 'change';
export type Severity = 'critical' | 'high' | 'medium' | 'low';

export interface Driver {
  domain: Domain;
  severity: Severity;
  summary: string;
}

export interface DomainKpis {
  schedule?: { spi: number; daysVariance: number; criticalPathItems: number };
  cost?: { cpi: number; contingencyDrawnPct: number; eacVarianceUsd: number };
  safety?: { trir: number; recordables14d: number; openActions: number };
  change?: { openCount: number; pendingValueUsd: number; avgAgeDays: number };
}

export interface PortfolioProject {
  id: string;
  name: string;
  region: string;
  businessUnit: string;
  health: Health;
  scheduleIndex: number;
  costIndex: number;
  criticalIssueCount: number;
  lastUpdated: string;
}

export interface ProjectDetail extends PortfolioProject {
  narrative: string;
  drivers: Driver[];
  needsSteer: boolean;
  domainKpis: DomainKpis;
}

export interface TimelineEvent {
  at: string;
  label: string;
}

export interface DriverIssue {
  id: string;
  projectId: string;
  domain: Domain;
  title: string;
  severity: Severity;
  ownerRole: string;
  recommendedAction: string;
  updatedAt: string;
  timeline: TimelineEvent[];
}

export const DOMAINS: Domain[] = ['schedule', 'cost', 'safety', 'change'];

export const HEALTH_RANK: Record<Health, number> = {
  red: 0,
  amber: 1,
  green: 2,
};
