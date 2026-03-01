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
- **Configuration tables**: plan rules/tiers/targets/bonuses/deal types/currency rates
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
**Status Update (2026-02-28): MVP Implemented**
1. ✅ Build plan simulation and forecasting engine with scenario storage.
2. ✅ Add commission estimator and deal prioritization insights for reps.
3. ✅ Implement formal statement approval workflow entity + transitions.

### P1 Validation Notes (2026-02-28)
- `src/fluent/tables/forecast_scenarios.now.ts` adds persisted scenario storage with multipliers and projected outputs.
- `src/server/script-includes/commission-p1-helper.js` and `src/fluent/script-includes/commission-p1-helper.now.ts` provide forecast, scenario save/list, estimator, and statement approval actions.
- `src/fluent/ui-pages/commission-progress.now.ts` now includes forecast simulation controls, prioritized opportunity ranking, and commission estimator UX.
- `src/fluent/tables/statement_approvals.now.ts` and `src/server/business-rules/statement-approval-workflow.js` add approval workflow entity and enforced transitions with statement status synchronization.

### Newly Identified Logic Gaps (2026-02-28 Addendum)
1. **Plan tiers are not consistently driving calculation/runtime logic**
   - **Observed behavior:** Tier records can exist but are not consistently applied to effective commission rate when attainment crosses floor thresholds.
   - **Required behavior:** Effective rate must change deterministically when attainment reaches each tier floor (including accelerators over 100% attainment).
   - **Action:** Centralize tier evaluation in calculation runtime and ensure the selected tier + effective rate are stored on calculation records.

2. **Commission performance tracker does not surface accelerator earnings clearly**
   - **Observed behavior:** Plan target rollup can calculate correctly, but accelerator impact/earnings are not transparently shown in attainment visuals and earnings breakdown.
   - **Required behavior:** UI must show base vs accelerator rate context and incremental earnings attributable to accelerator tiers.
   - **Action:** Add accelerator delta metrics to helper response and render dedicated accelerator earnings rows in progress cards/graphs.

3. **Plan bonus triggers are free-text and non-executable**
   - **Observed behavior:** Bonus trigger logic is stored as text only and does not drive deterministic bonus qualification.
   - **Required behavior:** Bonus triggers must be structured (typed conditions) and evaluated by runtime logic with auditable outcomes.
   - **Action:** Introduce bonus trigger schema (condition type/operator/threshold/scope) and enforce evaluation during calculation with explicit bonus-earned records.

4. **Deal type taxonomy is not normalized as a governed reference dimension**
   - **Observed behavior:** `deal_type` is represented as string values across deals/targets/tiers/bonuses/calculations, which can drift over time.
   - **Required behavior:** Deal type should be a managed reference entity with active/inactive governance, display metadata, and stable keys consumed consistently across runtime and UI.
   - **Action:** Introduce `deal_types` configuration table and migrate `deal_type` fields to reference/validated key usage.

### UI Smoke Checklist (2026-02-28)
#### Operations Dashboard (`src/fluent/ui-pages/commission-dashboard-redesigned.now.ts`)
- ✅ KPI year selector renders and drives metric refresh through `getDashboardMetrics`.
- ✅ KPI cards are clickable, keyboard accessible, and drill down to filtered lists.
- ✅ Year label behavior is stable (no repeated year suffix accumulation).
- ✅ KPI subtext and year note retain dark-theme styling (no white background regression).
- ✅ Navigation includes new P1 records: Forecast Scenarios and Statement Approvals.

#### Commission Performance Dashboard (`src/fluent/ui-pages/commission-progress.now.ts`)
- ✅ “View As” selector visibility and year filter are functional via `getViewerAccess` and `listUsersWithData`.
- ✅ Forecast Simulation section renders with scenario picker and multiplier controls.
- ✅ Commission Estimator action runs and returns projected payout output.
- ✅ Prioritized Opportunities table renders expected commission ranking rows.
- ✅ Fallback helper chain is active; `CommissionProgressDataService` contains P1 methods to avoid `AbstractAjaxProcessor` regression path.

## P2 (Admin/Workflow Maturity)
1. Add dispute case workflow with threaded commentary and SLAs.
2. Add bulk team/user/plan assignment tools and safe rollback.
3. Add manager/team rollup views and manager role governance.
4. ✅ Enforce deterministic tier evaluation and persisted effective tier/rate on calculations.
5. Add accelerator earnings visibility (base vs accelerator deltas) to performance tracking UI.
6. Replace free-text plan bonus triggers with structured, executable bonus logic.
7. Add a governed deal type reference table and migrate plan/deal configuration to use normalized deal type keys.

### P2 Validation Notes (2026-02-28)
- **Item 4 validated:** `src/server/business-rules/payment-commission.js` now centralizes tier evaluation via `evaluateEffectiveCommissionRate(...)`, selecting the highest active tier floor at or below attainment and applying the resulting effective rate deterministically.
- **Item 4 validated:** Calculation records now persist tier/rate context snapshots in runtime write path (`effective_tier_name`, `effective_tier_floor_percent`, `attainment_percent_at_calc`, `quota_amount_snapshot`, `attained_amount_snapshot`, `accelerator_applied`).
- **Item 4 validated:** Schema support exists in `src/fluent/tables/commission_calculations.now.ts` for all persisted tier snapshot fields used by the runtime.
- **Item 3 validated:** Deal Types governance UX is now exposed in application navigation (`src/fluent/application-menu.now.ts`) and operations dashboard quick links (`src/fluent/ui-pages/commission-dashboard-redesigned.now.ts`).
- **Item 3 validated:** Lifecycle impact controls now enforce safe deactivation with reference checks and override workflow (`src/server/business-rules/deal-type-governance.js`, `src/fluent/business-rules/deal-type-governance.now.ts`).
- **Item 3 validated:** Admin-only ACL controls were added for deal type governance records (`src/fluent/acls/commission-security.now.ts`) and a dedicated override request type was added (`src/fluent/tables/exception_approvals.now.ts`).
- **Backlog P2.4 validated:** Versioned recognition basis policies are now modeled per plan in `src/fluent/tables/plan_recognition_policies.now.ts` with supported basis options (`cash_received`, `invoice_issued`, `booking`, `milestone`).
- **Backlog P2.4 validated:** Policy lifecycle validation is enforced by `src/server/business-rules/plan-recognition-policy-validation.js` and `src/fluent/business-rules/plan-recognition-policy-validation.now.ts`, including date-range integrity, overlap controls, and exception-gated change governance.
- **Backlog P2.4 validated:** Admin governance UX and control wiring are deployed through `src/fluent/application-menu.now.ts`, `src/fluent/ui-pages/commission-dashboard-redesigned.now.ts`, `src/fluent/form-related-lists.now.ts`, `src/fluent/acls/commission-security.now.ts`, and `src/fluent/tables/exception_approvals.now.ts`.
- **Backlog P2.5 validated:** Payment runtime now resolves and applies plan recognition policy basis in `src/server/business-rules/payment-commission.js` via `resolveRecognitionPolicy(...)` and `resolveRecognitionContext(...)`, switching temporal lookup behavior by configured basis.
- **Backlog P2.5 validated:** Calculation records now persist policy snapshots (`recognition_basis_snapshot`, `recognition_policy_version_snapshot`, `recognition_policy_record`, `recognition_date_snapshot`, `temporal_lookup_date_snapshot`) in `src/fluent/tables/commission_calculations.now.ts` and runtime write path.
- **Backlog P2.5 validated:** Payout schedule snapshots now include recognition basis context in `payment-commission.js`, improving reproducibility and audit traceability of eligibility timing.
- **Backlog P2.12 validated:** Seed governance control properties are defined in `src/fluent/system-properties.now.ts` (`seed_navigation_enabled`, `seed_demo_data_enabled`, `seed_idempotency_mode`) to support controlled, environment-aware seeding behavior.
- **Backlog P2.12 validated:** Idempotent seed reconciliation is implemented in `src/server/scheduled-scripts/seed-governance-reconcile.js`, including duplicate module cleanup and duplicate demo-config cleanup logic under strict mode controls.
- **Backlog P2.12 validated:** A controlled reconciliation job record is deployed via `src/fluent/scheduled-scripts/seed-governance-reconcile.now.ts` and wired in `src/fluent/index.now.ts` for operational enable/disable governance.
- **Backlog P2.1 validated:** Bulk assignment run domain is now modeled in `src/fluent/tables/bulk_plan_assignment_runs.now.ts` with explicit preview/apply/rollback modes, execution status tracking, and rollback metadata fields.
- **Backlog P2.1 validated:** Runtime processor logic in `src/server/business-rules/bulk-plan-assignment.js` executes safe preview/apply/rollback with user validation, overlap checks, clone creation, and plan deactivation rollback handling.
- **Backlog P2.1 validated:** Admin governance and UX exposure were added via `src/fluent/business-rules/bulk-plan-assignment.now.ts`, `src/fluent/acls/commission-security.now.ts`, `src/fluent/application-menu.now.ts`, `src/fluent/ui-pages/commission-dashboard-redesigned.now.ts`, and index imports.
- **Backlog P2.2 validated:** Manager governance model is now explicit through `src/fluent/tables/manager_team_memberships.now.ts` with effective-dated manager-to-rep mappings, auditability, and governance metadata.
- **Backlog P2.2 validated:** Membership integrity checks are enforced in `src/server/business-rules/manager-team-governance.js` and `src/fluent/business-rules/manager-team-governance.now.ts` (active users, manager role requirement, overlap prevention, self-assignment block).
- **Backlog P2.2 validated:** Team rollup permission scope in `src/fluent/script-includes/commission-progress-helper.now.ts` now uses governed manager-team memberships (with direct-report fallback), and manager governance visibility is exposed in `src/fluent/acls/commission-security.now.ts`, `src/fluent/application-menu.now.ts`, and `src/fluent/ui-pages/commission-dashboard-redesigned.now.ts`.
- **Backlog P2.6 validated:** Forecast service in `src/fluent/script-includes/commission-progress-helper.now.ts` now projects payout timeline buckets by month using recognition-basis-aware date projection (`getForecastRecognitionProjection`) and payout schedule modeling (`getForecastPayoutScheduleForDate`).
- **Backlog P2.6 validated:** Forecast summary now includes dominant recognition basis context and timeline payload, and estimator output now includes projected recognition/payout-eligible dates tied to recognition basis assumptions.
- **Backlog P2.6 validated:** UI rendering in `src/fluent/ui-pages/commission-progress.now.ts` now shows projected payout timeline and recognition-basis details in forecast and estimator panels; assumption properties are governed in `src/fluent/system-properties.now.ts`.

## P3 (Enterprise/Compliance Expansion)
1. Multi-currency model with rate snapshots at calculation time.
2. Compliance-grade audit event journal and exports.
3. Advanced analytics layer (trend, cohort, variance analysis).

## Full Gap Re-Assessment (2026-02-28, Post-MVP)
> This section supersedes older static statements above where implementation has since changed.

### Intent & Operating Model (Professional Services)
- Sellers carry annual quota and are paid at different rates by governed deal type.
- Commissions are currently recognized on **cash received** (`payment_date`) and should support configurable alternate recognition methods.
- Plans must support tiered accelerators, one-time/ad-hoc bonuses (e.g., first time hitting quota), approvals, auditability, and finance-grade controls.

### Capability Coverage (Current Codebase)
| Area | Status | Evidence | Gap to Fully-Fledged System |
|---|---|---|---|
| Plan setup across targets/tiers/bonuses | **Partial-Strong** | `src/fluent/form-related-lists.now.ts`, `src/fluent/tables/plan_targets.now.ts`, `src/fluent/tables/plan_tiers.now.ts`, `src/fluent/tables/plan_bonuses.now.ts` | No composable rule engine for nested conditions/priority/conflict resolution. |
| Deterministic tiers/accelerators in runtime | **Strong** | `src/server/business-rules/payment-commission.js` (`evaluateEffectiveCommissionRate`, persisted effective tier fields + explainability components) | Remaining gap is richer workflow/context UX for finance and managers, not component-level explainability persistence. |
| Bonus logic execution | **Weak-Partial** | Bonus schema exists in `src/fluent/tables/plan_bonuses.now.ts` | `bonus_trigger` remains free-text; payout qualification is not executed deterministically in runtime. |
| Forecasting/simulation | **Partial** | `src/fluent/tables/forecast_scenarios.now.ts`, forecast methods in `src/fluent/script-includes/commission-progress-helper.now.ts` | Model is heuristic (stage probabilities), lacks scenario governance/versioning and finance calibration workflow. |
| Estimator UX for reps | **Partial-Strong** | `estimateCommission` in `src/fluent/script-includes/commission-progress-helper.now.ts`, UI in `src/fluent/ui-pages/commission-progress.now.ts` | Estimate is single-deal oriented; no full payout-timeline forecast across expected cash receipts. |
| Real-time role visibility | **Partial-Strong** | Access + team/all behavior in progress helper; roles in `src/fluent/roles/commission-roles.now.ts` | Finance/manager dedicated cockpit pages and queue-driven workflows are still limited. |
| Statement approvals workflow | **Partial-Strong** | `src/fluent/tables/statement_approvals.now.ts`, `src/server/business-rules/statement-approval-workflow.js` | Approval model is present but does not include SLA timers/escalations/delegations in workflow entity. |
| Dispute management/commentary | **Weak** | Dispute fields exist on calculations (`src/fluent/tables/commission_calculations.now.ts`) | No dispute case table, no threaded comments, no assignment/SLA lifecycle. |
| Audit/compliance controls | **Partial-Strong** | Broad `audit: true`; reconciliation/alerts in scheduled scripts + monitoring tables | No immutable event journal for full calculation lineage and evidence export. |
| Deal type governance | **Partial-Strong (new)** | `src/fluent/tables/deal_types.now.ts`, seed data + validation rules | Need UI module/list integration and migration hardening for legacy values/reporting consistency. |
| Payout basis flexibility | **Strong** | Runtime basis switch + policy resolution + calc-time snapshot persistence are implemented in `src/server/business-rules/payment-commission.js` and `src/fluent/tables/commission_calculations.now.ts` | Remaining gap is operational explainability/UX depth, not basis-switch correctness. |
| Multi-currency | **Missing** | No FX table/services/snapshots | Required for enterprise finance parity and cross-geo professional services operations. |

### UI Functionality Assessment (What Works vs What’s Missing)
- **Working now:** rep progress dashboard, estimator action, forecast scenario controls, prioritized opportunities, operations dashboard KPI drill-downs, statement approval records, and plan setup related lists.
- **Missing for production maturity:** dedicated finance cockpit (approval queues + payout windows), manager cockpit with coaching/forecast views, dispute workspace, and richer payout explainability for reps/finance.
- **Explainability:** Base commission vs accelerator delta vs bonus component is now surfaced in progress and statement data outputs; next uplift is richer visual drill-down and manager/finance workflow context.

### Additional Requirements Missing from Baseline List
1. **Runtime execution of configurable recognition basis** with calc-time reproducibility snapshots (**implemented**).
2. **Executable bonus qualification engine** for ad-hoc and milestone bonuses (e.g., one-time quota-hit bonus), with deterministic audit records (**implemented**).
3. **Payout timeline forecasting** from expected cash receipts (not only weighted deal-stage estimates) (**partially implemented; needs deeper finance calibration and receipt-lifecycle modeling**).
4. **Dispute case management domain** (case table, threaded commentary, SLA/aging, ownership, resolution actions).
5. **Finance/manager operational workspaces** beyond list navigation (queues, bottlenecks, exception aging, approvals throughput).
6. **Deal type governance UX** (module, lifecycle management, controlled deprecation/merge impact analysis).
7. **Policy versioning and reproducibility** for payout basis, rate-card logic, and rule snapshots at calc-time.

### Scenario Readiness (Professional Services)
| Scenario | Current Readiness | Notes |
|---|---|---|
| Quota-carrying sellers by deal type with tiered accelerators | **Good** | Deterministic tier selection and persisted snapshots are implemented. |
| One-time quota-hit bonus payout | **Good** | Structured bonus conditions + calc-time earned-record persistence + one-time period dedupe are now implemented. |
| Cash-received commission payout forecasting | **Partial** | Cash-received calc exists; forecasting does not yet model receipt schedule lifecycle in depth. |
| Alternate payout basis by policy | **Good** | Versioned recognition policy model is configurable by plan and runtime now applies selected basis with persisted policy snapshots on each calculation. |
| Manager-led team planning and governance | **Partial** | Team rollups exist; dedicated manager workflow/dashboard depth remains limited. |
| Finance close/approval/dispute operations | **Partial-Weak** | Statement approvals exist; dispute case and audit-grade event lineage remain missing. |

### Consolidated Outstanding Build & Deploy Backlog (Single Source of Truth)
> This is the canonical ordered sequence for remaining work. Completed items are marked inline for traceability.

| Seq | Backlog ID | Capability | Build Scope | Deploy Gate (must pass before next) | Est. |
|---|---|---|---|---|---|
| 1 | P2.1 ✅ | Bulk assignment | Bulk user/team/plan assignment tool with preview and rollback | ✅ Completed 2026-03-01: preview/apply/rollback run engine + admin UX/ACL wiring deployed; diagnostics clean | M |
| 2 | P2.2 ✅ | Manager governance | Manager/team rollup workflow hardening + manager operational views | ✅ Completed 2026-03-01: governed manager scope model + rollup permission hardening + admin UX wiring; diagnostics clean | M |
| 3 | P2.3 ✅ | Deal type governance UX | Add Deal Types module/list/form; lifecycle controls and impact checks | ✅ Completed 2026-02-28: diagnostics clean; lifecycle guardrails active | S-M |
| 4 | P2.4 ✅ | Recognition basis policy | Add configurable recognition basis (`cash_received`,`invoice_issued`,`booking`,`milestone`) and plan-level versioned policy | ✅ Completed 2026-02-28: data model/validation/UX wiring deployed; runtime parity preserved in cash mode | M |
| 5 | P2.5 ✅ | Runtime basis switch | Calculation runtime uses selected recognition basis; persist applied policy snapshot | ✅ Completed 2026-03-01: runtime basis switch + policy snapshots persisted; diagnostics clean | M |
| 6 | P2.6 ✅ | Forecast payout timeline | Forecast/estimator supports payout timeline by recognition basis (not just stage heuristics) | ✅ Completed 2026-03-01: basis-aware payout timeline projection + estimator payout dates + UI rendering delivered; diagnostics clean | M-L |
| 7 | P2.7 ✅ | Bonus rule schema | Replace free-text bonus triggers with structured, validated bonus conditions | ✅ Completed 2026-03-01: structured qualification metric/operator/threshold/period model + validation BR + condition summary snapshot deployed | M |
| 8 | P2.8 ✅ | Bonus execution engine | Deterministic bonus eligibility at calc-time + persisted bonus-earned records | ✅ Completed 2026-03-01: calc-time evaluator + persisted `bonus_earnings` records + calculation bonus snapshots deployed | L |
| 9 | P2.9 ✅ | One-time quota bonus | One-time quota-hit bonus logic (once per rep/period) | ✅ Completed 2026-03-01: one-time-per-period dedupe guard across recalculation/reopen paths via period-keyed earned-record checks | S-M |
| 10 | P2.10 ✅ | Accelerator explainability | Persist and render base vs accelerator delta in progress/statement views | ✅ Completed 2026-03-01: calculation component snapshots + progress UI explainability breakdown + statement-level component totals delivered | M |
| 11 | P2.11 | Finance cockpit | Queue-driven finance workspace (approvals, payout windows, exceptions) | End-to-end statement approval throughput and queue SLA test | M-L |
| 12 | P2.12 ✅ | Seed governance hardening | Environment-gated/idempotent seed strategy for app menu + demo data, with controlled enablement and duplicate safeguards | ✅ Completed 2026-03-01: seed controls + reconciliation job deployed; diagnostics clean | S-M |
| 13 | P3.1 | Dispute case domain | First-class dispute case entity, ownership, status lifecycle, SLA timers | Dispute lifecycle test (open→resolve→reopen) + SLA alerts | M |
| 14 | P3.2 | Threaded commentary | Discussion threads on disputes/statements/calculations with ACL controls | Persona permission tests + full conversation history integrity | M |
| 15 | P3.3 | Immutable event journal | Append-only lifecycle events for calc/approval/dispute transitions | Event immutability checks + hash/tamper verification | L |
| 16 | P3.4 | Compliance exports | Export-ready evidence packages (period close, approvals, disputes, events) | Audit sample export accepted by finance/compliance stakeholders | M |
| 17 | P3.5 | Multi-currency | FX rate table + rate snapshots at calc-time + reporting currency conversions | Reconciliation tests across mixed-currency scenarios | L |
| 18 | P3.6 | Analytics maturity | Trend/cohort/variance analytics with saved views by role | Metric parity checks against source transactional data | M |

### Build/Deploy Waves
- **Wave A (Seq 1–3):** Admin and governance foundation.
- **Wave B (Seq 4–10):** Core payout correctness and explainability.
- **Wave C (Seq 11–14):** Operational workflows and deployment governance.
- **Wave D (Seq 15–18):** Compliance and enterprise scale.

### Release Exit Criteria (Program-Level)
- 100% calculations reproducible from persisted policy/rule/tier/bonus snapshots.
- Bonus outcomes are machine-evaluated and auditable; no free-text-only payout decisions.
- Forecast includes payout timeline by configured recognition basis.
- Finance and manager operations run from dedicated queue-driven UI workflows.
- Dispute + audit evidence lifecycle is fully in-app and export-ready.

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
