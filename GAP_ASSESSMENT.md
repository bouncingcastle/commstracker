# Commission Management Gap Assessment

## Executive Summary
This assessment compares the current application implementation against the requested feature set across plan design, visibility, reporting, controls, enablement, and compliance.

### Overall Readiness
- Core commission operations: **Strong**
- Advanced planning/forecasting: **Partial**
- Admin workflow maturity: **Partial**
- Enterprise controls/compliance depth: **Partial**

## Scoring Scale
- **Low Gap**: Capability largely implemented and operational
- **Medium Gap**: Capability partially implemented; key workflow gaps remain
- **High Gap**: Capability mostly missing or structurally incomplete

---

## Feature-by-Feature Gap Matrix

## 1) Plan Design & Calculation
| Capability | Gap | Current State | Key Evidence | Recommendation |
|---|---|---|---|---|
| Flexible commission plan setup (simple to complex) | **Medium** | Plans, targets, tiers, bonuses exist with effective dating | `src/fluent/tables/commission_plans.now.ts`, `src/fluent/tables/plan_targets.now.ts`, `src/fluent/tables/plan_tiers.now.ts`, `src/fluent/tables/plan_bonuses.now.ts` | Add rule-composition model (condition groups, priority, reusable rule templates) |
| Accelerators, tiers, multiple triggers, nuanced logic | **Medium** | Tiers and bonus triggers exist; nuanced conditional engine is limited | `src/fluent/tables/plan_tiers.now.ts`, `src/fluent/tables/plan_bonuses.now.ts` | Add trigger evaluator service (attainment, milestone, behavior, product mix) |
| Rules/conditions (override, scheduling, flat/percentage) | **Medium** | Override + approval flows exist; flat-vs-percent and rule scheduling are not first-class entities | `src/server/business-rules/commission-plan-validation.js`, `src/server/business-rules/payment-commission.js` | Introduce explicit commission rule table with calculation method enum and schedule conditions |
| Modeling, forecasting, simulation/testing | **High** | No what-if/simulation pipeline found | N/A (no simulation module/pages/services) | Build simulation engine and sandbox plan runner |
| Commission estimator / potential earnings insights | **Medium** | OTE/targets visible in rep progress; no interactive estimator across scenarios | `src/fluent/ui-pages/commission-progress.now.ts`, `src/server/script-includes/commission-progress-helper.js` | Add estimator widget with deal-level scenario inputs and projected payout |

## 2) Real-Time Tracking & Visibility
| Capability | Gap | Current State | Key Evidence | Recommendation |
|---|---|---|---|---|
| Real-time visibility (rep, manager, finance) | **Medium** | Near-real-time for reps/admin via UI + helper; manager role/workflow not explicit | `src/fluent/ui-pages/commission-progress.now.ts`, ACLs in `src/fluent/acls/commission-security.now.ts` | Add dedicated manager role, team rollups, and manager dashboards |
| Current, past, forecasted earnings | **High** | Current/past present; forecast absent | Progress helper aggregates historical/current only | Add forecast service (pipeline-weighted + scenario modes) |
| Live dashboards and analytics reporting | **Medium** | Operational + rep dashboards exist with year filters and KPI cards | `src/fluent/ui-pages/commission-dashboard-redesigned.now.ts`, `src/fluent/ui-pages/commission-progress.now.ts` | Add charting trend layers and saved analytics views |

## 3) Reporting & Insight
| Capability | Gap | Current State | Key Evidence | Recommendation |
|---|---|---|---|---|
| Detailed compensation statements with drill-downs | **Medium** | Statement records generated and linked to calculations; drill-down UX is table/list-driven, not a rich statement experience | `src/server/scheduled-scripts/monthly-statements.js`, `src/fluent/tables/commission_statements.now.ts` | Add statement detail page with line-item breakout and approval history timeline |

## 4) Commission Administration & Controls
| Capability | Gap | Current State | Key Evidence | Recommendation |
|---|---|---|---|---|
| Deep audit trails for all changes/calculations | **Low-Medium** | Audit-enabled tables + reconciliation logs + exception/audit alerts exist | `audit: true` on core tables, `src/server/scheduled-scripts/daily-reconciliation.js`, `src/fluent/monitoring-tables.now.ts` | Add immutable event journal for calculation lifecycle and approval state transitions |
| Effective dating on plans, logic, users | **Medium** | Plans are effectively dated; logic/users not fully versioned as first-class temporal records | `src/fluent/tables/commission_plans.now.ts`, role assignments demo in `src/fluent/user-role-setup.now.ts` | Add versioned logic records and effective team assignment model |
| Bulk user/team/plan management | **High** | No bulk assignment UX/workflow found | No dedicated bulk module/page | Add bulk import/assignment tool with preview + rollback |
| Approval workflows for commission statements | **Medium-High** | Exception approvals exist; statement lifecycle includes draft/locked/paid but no formal approval workflow object/state machine | `src/fluent/tables/exception_approvals.now.ts`, `src/fluent/tables/commission_statements.now.ts` | Add statement approval table + multi-step workflow (submit/review/approve/reject) |
| Dispute management and in-app commentary (next phase) | **High** | Dispute fields exist on calculations but no full dispute case workflow or commentary thread UX | `src/fluent/tables/commission_calculations.now.ts` fields only | Add dispute case entity, threaded comments, SLA timers, resolution actions |

## 5) Motivation & Sales Enablement
| Capability | Gap | Current State | Key Evidence | Recommendation |
|---|---|---|---|---|
| Performance metrics / KPI tracking | **Low** | KPI cards, pipeline and quota progress exist | `src/fluent/ui-pages/commission-progress.now.ts`, `src/server/script-includes/commission-progress-helper.js` | Add trend deltas and attainment trajectory indicators |
| Potential earnings visibility for prioritization | **Medium** | OTE and bonus potential shown; no opportunity prioritization scoring | Progress page OTE/bonus sections | Add deal ranking by projected commission and quota impact |

## 6) Currency & Compliance Support
| Capability | Gap | Current State | Key Evidence | Recommendation |
|---|---|---|---|---|
| Multi-currency conversion and rate management (next phase) | **High** | No FX tables/services/rate snapshots found | No currency model entities in tables or scripts | Add currency rate table, rate snapshot on calculation, base/reporting currency controls |

---

## Cross-Cutting Architecture Risks (High Priority)

1. **Deployment wiring inconsistency**
   - **Status (2026-02-28): Resolved.** Stale/missing rep compensation UI import mismatch removed from `src/fluent/index.now.ts`.

2. **Schema/runtime drift risk on payout eligibility**
   - **Status (2026-02-28): Resolved.** `payout_eligible_date` and `payout_schedule_snapshot` aligned in `src/fluent/tables/commission_calculations.now.ts` and server runtime scripts.

3. **Partial import scope in Fluent index**
   - **Status (2026-02-28): Resolved.** `src/fluent/index.now.ts` now imports core deployment assets (roles, ACLs, system properties, monitoring tables, scheduled jobs, business rules, core tables, and APIs), including daily reconciliation job wiring.

---

## Target-State Architecture (Recommended)

### Domain Services
- **Ingestion Service**: Source adapters (Bigin/Books) + idempotency + schema validation
- **Rule Engine Service**: versioned rule sets (conditions, priorities, methods, schedules)
- **Calculation Service**: deterministic calculation with audit event stream
- **Forecast/Simulation Service**: what-if scenarios and plan impact modeling
- **Payout Service**: configurable scheduling + payroll cycle abstractions
- **Workflow Service**: statement approvals + disputes + commentary + SLA

### Data Layers
- **Transactional tables**: deals/invoices/payments/calculations/statements
- **Configuration tables**: plan rules/tiers/targets/bonuses/currency rates
- **Workflow tables**: approvals/disputes/comments/tasks
- **Audit ledger**: immutable event records for compliance traceability

### UI Layers
- **Operations dashboard**: KPI + control center + exception queue
- **Rep cockpit**: current/past/forecast + estimator + prioritized opportunities
- **Finance cockpit**: approval queues + payroll windows + reconciliation
- **Admin workspace**: bulk assignment + plan lifecycle + simulation publishing

---

## Prioritized Backlog

## P0 (Stabilization / Integrity)
**Status Update (2026-02-28): Completed**
1. ✅ Fix missing import/file mismatch for rep compensation page reference.
2. ✅ Validate and align payout-eligibility schema/runtime fields across fluent/server.
3. ✅ Ensure fluent index import coverage includes required deployment assets (roles, ACLs, system properties, monitoring tables, scheduled jobs, business rules).

### Validation Notes (2026-02-28)
- **Claim 1 validated:** `src/fluent/index.now.ts` contains active UI imports for `commission-dashboard-redesigned` and `commission-progress`, with no stale rep-compensation UI page import.
- **Claim 2 validated:** `payout_eligible_date` and `payout_schedule_snapshot` are present in `src/fluent/tables/commission_calculations.now.ts` and are written/read by `src/server/business-rules/payment-commission.js`, `src/server/scheduled-scripts/monthly-statements.js`, and `src/server/scheduled-scripts/backfill-payout-eligibility.js`.
- **Claim 3 validated:** `src/fluent/index.now.ts` imports roles, ACLs, system properties, monitoring tables, scheduled scripts (`monthly-statements`, `daily-reconciliation`, `backfill-payout-eligibility`), business rules, core tables, and API records.

## P1 (Core Product Gap Closure)
1. Build plan simulation and forecasting engine with scenario storage.
2. Add commission estimator and deal prioritization insights for reps.
3. Implement formal statement approval workflow entity + transitions.

## P2 (Admin/Workflow Maturity)
1. Add dispute case workflow with threaded commentary and SLAs.
2. Add bulk team/user/plan assignment tools and safe rollback.
3. Add manager/team rollup views and manager role governance.

## P3 (Enterprise/Compliance Expansion)
1. Multi-currency model with rate snapshots at calculation time.
2. Compliance-grade audit event journal and exports.
3. Advanced analytics layer (trend, cohort, variance analysis).

---

## Release Readiness by Workstream
- Plan Design & Calculation: **Amber**
- Real-Time Visibility: **Amber**
- Reporting & Insight: **Amber**
- Administration & Controls: **Amber/Red**
- Motivation & Enablement: **Amber**
- Currency & Compliance: **Red**

---

## Suggested KPIs for Gap Closure
- % calculations reproducible from rule snapshot (target: 100%)
- Statement approval turnaround time (target: < 48h)
- Dispute resolution SLA attainment (target: > 95%)
- Forecast accuracy variance at month end (target: < 10%)
- Backfill/data integrity exceptions per run (target: 0 critical)
