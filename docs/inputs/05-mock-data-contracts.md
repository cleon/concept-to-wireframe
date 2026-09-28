# EXAMPLE — Mock data contracts (no live APIs)

All data is static JSON (or in-memory fixtures) shipped with the Angular app.

## PortfolioProject
- id, name, region, businessUnit
- health: red | amber | green
- scheduleIndex (number), costIndex (number)
- criticalIssueCount (number)
- lastUpdated (ISO string, fake)

## ProjectDetail extends PortfolioProject
- narrative (string)
- drivers: [{ domain: schedule|cost|safety|change, severity, summary }]
- needsSteer (boolean, mutable in UI session only)

## DriverIssue
- id, projectId, domain, title, severity, ownerRole, recommendedAction, updatedAt

## Rules for stubs
- 8–12 portfolio projects across 2–3 regions
- At least 2 red, 3 amber, rest green
- Every red project has ≥2 drivers populated
- No real employee names; use role labels (`EXAMPLE — Cost Lead`)
- No customer/PHI; site names are fictional (`EXAMPLE — Riverbend Interchange`)
