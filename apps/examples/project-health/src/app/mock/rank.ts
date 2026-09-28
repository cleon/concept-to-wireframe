import { HEALTH_RANK, type Domain, type Health, type PortfolioProject } from './types';

export interface PortfolioFilters {
  region: string;
  businessUnit: string;
  health: Health | 'all';
}

export function filterAndRank<T extends PortfolioProject>(
  projects: readonly T[],
  filters: PortfolioFilters,
): T[] {
  return projects
    .filter((project) => {
      if (filters.region !== 'all' && project.region !== filters.region) {
        return false;
      }
      if (filters.businessUnit !== 'all' && project.businessUnit !== filters.businessUnit) {
        return false;
      }
      if (filters.health !== 'all' && project.health !== filters.health) {
        return false;
      }
      return true;
    })
    .slice()
    .sort((a, b) => {
      const healthDelta = HEALTH_RANK[a.health] - HEALTH_RANK[b.health];
      if (healthDelta !== 0) {
        return healthDelta;
      }
      return b.criticalIssueCount - a.criticalIssueCount;
    });
}

export function isDomain(value: string | undefined): value is Domain {
  return value === 'schedule' || value === 'cost' || value === 'safety' || value === 'change';
}
