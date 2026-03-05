# Commission Management Gap Assessment

## Canonical Governance
- This file is the single source of truth for architecture status, backlog state, roadmap sequencing, and release readiness.
- If any other project doc conflicts with this file, this file wins until reconciled.
- Every proposed change must include a Function Impact Record (see Change Control).
- Every status change must update both the Functional Baseline and Current Tracks sections.

## Current Program Focus
1. Base functionality reliability (deterministic runtime + end-to-end flow correctness)
2. Data model architecture hardening (plan/tier/bonus/policy/classification/statement integrity)
3. Adoption readiness (stable UX, safe roles/access, predictable operations)

## Current Tracks (Lean SoT)
| Track | Priority | Status | Scope | Gate |
|---|---|---|---|---|
| T1 Base Business Invariants | P0 | Complete / monitor | Close-date quota, cash-date payout, subtotal base, owner/rate snapshots, refunds, exceptions, duplicate prevention | Regression checks remain green |
| T2 Core Data Model Architecture | P0 | In progress | Governed plan hierarchy + classification + approvals + bonus earnings + manager memberships | UC-01..UC-03 + Core UI sections 1–2 |
| T3 Runtime Determinism & Explainability | P0 | Complete / stabilize | Tier selection, marginal math, recognition snapshots, structured bonus + one-time dedupe, component persistence | UC-04..UC-10 reproducible |
| T4 Core Workflow Usability | P0 | In progress | Progress/dashboard/statement UX, role boundaries, no-regression behavior | Core UI checklist full pass |
| T5 Integration & Operational Readiness | P1 | Open | Zoho sync validation, statements runbook, monitoring/load readiness | Next-steps + safeguards checklist closure |
| T6 Finance Operations Cockpit | P1 | Open | Queue-driven finance workspace (approvals, payout windows, exceptions, SLA throughput) | P2.11 gate |
| T7 Dispute + Compliance Domain | P2 | Open | Dispute case model, commentary, immutable lifecycle journal, evidence exports | P3.1–P3.4 gates |
| T8 Enterprise Scale Features | P3 | Open | Multi-currency FX snapshots + analytics maturity | P3.5–P3.6 gates |

## Core Platform Functional Use-Case Baseline
> Architecture contract set. Every change must map to one or more Function IDs.

| ID | Functional Use Case | Status |
|---|---|---|
| F-01 | Plan setup end-to-end (plan + targets + tiers + bonuses + recognition policies) | Implemented |
| F-02 | Tier governance (explicit contiguous bands, overlap/gap prevention) | Implemented |
| F-03 | Deal classification governance (single primary, no duplicate mapping) | Implemented |
| F-04 | Close-won snapshot immutability with approved override path | Implemented |
| F-05 | Payment-driven commission calculation on cash events | Implemented |
| F-06 | Highest-applicable effective rate selection for multi-classification deals | Implemented |
| F-07 | Marginal tier payout + base/accelerator/bonus explainability | Implemented |
| F-08 | Structured bonus qualification + one-time-per-period dedupe | Implemented |
| F-09 | Recognition-basis policy execution with calc-time snapshots | Implemented |
| F-10 | Forecast scenario + estimator baseline | Partial-Strong |
| F-11 | Monthly statement generation | Implemented |
| F-12 | Statement approval transitions and state sync | Implemented |
| F-13 | Statement explainability drill-down | Implemented |
| F-14 | Role-based visibility with governed team scope | Implemented |
| F-15 | Effective-dated manager-to-rep governance model | Implemented |
| F-16 | Bulk plan assignment (preview/apply/rollback) | Implemented |
| F-17 | Exception queue + reconciliation + operational alerts | Implemented |
| F-18 | Zoho ingestion APIs (deals/invoices/payments) | Implemented |
| F-19 | Finance cockpit queue workspace | Open |
| F-20 | First-class dispute case lifecycle (ownership/SLA) | Open |
| F-21 | Threaded commentary (disputes/statements/calculations) | Open |
| F-22 | Immutable event journal + compliance evidence exports | Open |
| F-23 | Multi-currency FX model + calc-time snapshot | Open |
| F-24 | Analytics maturity (trend/cohort/variance saved views) | Open |

## Roadmap (Lean)
| Phase | Focus | Exit Criteria |
|---|---|---|
| Phase 0 (Current) | T1–T4 | Core UI checklist + UC-01..UC-12 pass; deterministic reproducibility maintained |
| Phase 1 | T5 | Integration, runbook, security, and monitoring readiness checklist complete |
| Phase 2 | T6 | Finance cockpit queue operational with measurable throughput/SLA |
| Phase 3 | T7–T8 | Dispute/compliance lifecycle and enterprise scale controls accepted |

### Current Open Build Items
1. P2.11 Finance cockpit
2. P3.1–P3.4 Dispute/compliance domain
3. P3.5 Multi-currency
4. P3.6 Analytics maturity

## Architectural Validity Snapshot (2026-03-05)
- Verdict: **Conditionally valid** as canonical SoT.
- Confirmed in code: T1–T3 implemented and wired; T5 present but operationally open; T6–T8 correctly open.
- 2026-03-05 refactor slice: schema typing/index hardening applied on core transactional paths (`deals`, `commission_calculations`, ingestion date normalization) to improve ServiceNow model quality and extensibility.
- Caveat A: menu deployment drift risk previously existed; controlled remediation is in progress.
- Caveat B: no append-only immutable event-journal domain yet; keep F-22/T7 open.

## Controlled Remediation: Menu Deployment Wiring (T4 Caveat)
| Step | Status | Note |
|---|---|---|
| M1 Baseline menu/module inventory | In progress (automation added) | Reconciliation now captures module totals/uniques/actives + records checked in `x_823178_commissio_reconciliation_log` |
| M2 Controlled seed mode verification | In progress (automation added) | Reconciliation now records seed mode + seed toggles (`mode`, `navSeedEnabled`, `demoSeedEnabled`) as evidence |
| M3 Re-enable `application-menu.now` import | Completed (2026-03-05) | `src/fluent/index.now.ts` import re-enabled |
| M4 Run seed-governance reconcile | Pending (automation enhanced) | Reconcile now writes structured evidence to `x_823178_commissio_reconciliation_log` |
| M5 Role-based UX/menu validation | Pending (repo precondition fixed) | Admin/Manager/Finance/Rep navigation smoke; `role-access-model.js` dependency now present |
| M6 Promote T4 caveat to closed | Pending | Requires two clean deploy passes with evidence |

### AE Demo Readiness Gate (Target: Account Executive Progress Demo)
Required to declare demo-ready:
1. M4 complete with reconciliation evidence (no duplicate/broken menu entries for Dashboard/My Progress).
2. M5 complete with role-path evidence (Rep own view, Manager team view, Finance/Admin broad view).
3. At least 2 AEs show valid progress page output for selected year:
	- Active plan card visible
	- Quota progress populated (targets vs won deals)
	- Earned/Pending/Paid metrics populated (from calculations)
	- Active pipeline list/value populated (from open deals)

This gate is data-agnostic: records may be manually created for demo setup as long as table linkages are valid.

## Production MVP Exit Checklist (Binary Go/No-Go)
Production MVP is **Go** only when all items below are complete with evidence:

| Exit Item | Current Status | Evidence Required |
|---|---|---|
| E1: T4 remediation closure (M4/M5/M6) | In progress | Reconcile output logs + role-nav smoke results + two clean deploy passes |
| E2: Role/access UAT sign-off (Rep/Manager/Finance/Admin) | Pending | Access matrix with pass/fail and approver |
| E3: Month-end dry run (ingest→calc→statement→approval) | Pending | Single-cycle run log with zero critical integrity exceptions |
| E4: Operational readiness pack (runbook + alert ownership + rollback) | Pending | Published runbook + owner roster + rollback steps validated |
| E5: Production cutover and first-week hypercare plan | Pending | Named owners, timelines, escalation path |

**Current verdict (2026-03-05):** No-Go for production MVP, Go for controlled demo/pilot.

Automation now available to accelerate evidence capture:
- `Commission Seed Governance Reconciliation` (enhanced) logs duplicate/seed posture metrics to reconciliation log.
- `Commission Architecture Integrity Check` (new, default inactive) validates required tables/roles/properties/modules/jobs and logs a single architecture readiness record.
- `Commission Production MVP Readiness Check` (new, default inactive) logs module/role/seed posture checks to reconciliation log + alerts.
- `Commission Month-End Readiness Audit` (new, default inactive) logs month-end operational metrics and integrity warnings/errors to reconciliation log + alerts.

## Change Control (Mandatory)
For every proposed change, record this in this file before implementation:
1. Impacted Function IDs (`F-xx`)
2. Change Type (`behavioral`, `data model`, `workflow`, `access control`, `integration`, `observability`)
3. Expected Effect (`no functional change`, `enhancement`, `deprecation`, `breaking`)
4. Validation Mapping (UC/checklist/tests required)
5. Gap Impact (T-track / backlog / phase changes)
6. SoT Delta (which sections in this file must be updated)

### Function Impact Record Template
| Field | Value |
|---|---|
| Change ID | |
| Date | |
| Summary | |
| Impacted Functions | |
| Change Type | |
| Expected Effect | |
| Required Validation | |
| Gap Impact | |
| SoT Sections Updated | |
| Decision | |

### Function Impact Record Log
| Field | Value |
|---|---|
| Change ID | FIR-2026-03-05-001 |
| Date | 2026-03-05 |
| Summary | Data model hardening for ServiceNow best practices: date/counter typing + query-path indexes + ingestion date normalization |
| Impacted Functions | F-01, F-04, F-05, F-07, F-08, F-09, F-11, F-17, F-18 |
| Change Type | data model, integration, observability |
| Expected Effect | enhancement (no functional behavior change intended) |
| Required Validation | Targeted lint/error scan on modified files; regression checks for payment/deal date paths and statement generation |
| Gap Impact | Supports T2 hardening and T3 stabilization; no phase change |
| SoT Sections Updated | Architectural Validity Snapshot, Function Impact Record Log |
| Decision | Approved and implemented |

| Field | Value |
|---|---|
| Change ID | FIR-2026-03-05-002 |
| Date | 2026-03-05 |
| Summary | Lifecycle/versioning and queue extensibility hardening for plans, recognition policies, statements, and statement approvals |
| Impacted Functions | F-01, F-09, F-11, F-12, F-13, F-19 |
| Change Type | data model, workflow |
| Expected Effect | enhancement (forward-compatible architecture uplift) |
| Required Validation | Modified-file diagnostics clean; statement approval transition sanity on submitted/review/decision paths |
| Gap Impact | Advances T2 architecture hardening and T6 readiness foundations; no track state flip yet |
| SoT Sections Updated | Function Impact Record Log |
| Decision | Approved and implemented |

| Field | Value |
|---|---|
| Change ID | FIR-2026-03-05-003 |
| Date | 2026-03-05 |
| Summary | Runtime governance validation for plan/policy lifecycle, version sequencing, and supersede-chain integrity |
| Impacted Functions | F-01, F-09, F-12, F-19 |
| Change Type | workflow, data model |
| Expected Effect | enhancement (enforces coherent lifecycle transitions and version lineage) |
| Required Validation | Modified-file diagnostics clean; create/update attempts for invalid lifecycle/version/supersede scenarios fail with clear messages |
| Gap Impact | Advances T2 architectural integrity; reduces rollout risk for T6 queue governance |
| SoT Sections Updated | Function Impact Record Log |
| Decision | Approved and implemented |

| Field | Value |
|---|---|
| Change ID | FIR-2026-03-05-004 |
| Date | 2026-03-05 |
| Summary | Added AE demo readiness operational gate and minimum data-linkage criteria for progress dashboard handoff |
| Impacted Functions | F-10, F-14, F-17 |
| Change Type | workflow, observability |
| Expected Effect | enhancement (delivery readiness clarity; no runtime behavior change) |
| Required Validation | Execute M4/M5 evidence checklist and confirm 2 AE demo passes |
| Gap Impact | Clarifies T4 closure criteria and accelerates T5 adoption readiness |
| SoT Sections Updated | Controlled Remediation, Function Impact Record Log |
| Decision | Approved and pending execution in instance |

| Field | Value |
|---|---|
| Change ID | FIR-2026-03-05-005 |
| Date | 2026-03-05 |
| Summary | Added production MVP binary exit checklist and fixed missing role-access script include dependency |
| Impacted Functions | F-12, F-14, F-17 |
| Change Type | workflow, access control |
| Expected Effect | enhancement (release-readiness clarity + role-validation runtime dependency restored) |
| Required Validation | Diagnostics clean on new script include; execute M4/M5 operational evidence steps in instance |
| Gap Impact | Advances T4 remediation and strengthens T5 readiness gating |
| SoT Sections Updated | Controlled Remediation, Production MVP Exit Checklist, Function Impact Record Log |
| Decision | Approved; repo-side remediation implemented, instance execution pending |

| Field | Value |
|---|---|
| Change ID | FIR-2026-03-05-006 |
| Date | 2026-03-05 |
| Summary | Added structured reconciliation evidence logging and baseline metrics capture to seed-governance reconcile path |
| Impacted Functions | F-17, F-18 |
| Change Type | observability, workflow |
| Expected Effect | enhancement (M1/M2/M4 evidence captured automatically in reconciliation log) |
| Required Validation | Diagnostics clean; execute reconcile job and confirm `x_823178_commissio_reconciliation_log` row contains mode/toggle/module metrics |
| Gap Impact | Reduces manual work for T4 remediation closure and improves T5 operational readiness proof |
| SoT Sections Updated | Controlled Remediation, Function Impact Record Log |
| Decision | Approved and implemented (instance run pending) |

| Field | Value |
|---|---|
| Change ID | FIR-2026-03-05-007 |
| Date | 2026-03-05 |
| Summary | Added production MVP readiness scheduled check and wired deployment import for automated E1/E4 prerequisite validation |
| Impacted Functions | F-14, F-17, F-18 |
| Change Type | observability, workflow, access control |
| Expected Effect | enhancement (faster release gating with repeatable readiness evidence) |
| Required Validation | Diagnostics clean; execute readiness check job and verify reconciliation log + alert outputs |
| Gap Impact | Strengthens T5 readiness and reduces manual gate drift across production cutover checks |
| SoT Sections Updated | Controlled Remediation, Production MVP Exit Checklist, Function Impact Record Log |
| Decision | Approved and implemented (instance run pending) |

| Field | Value |
|---|---|
| Change ID | FIR-2026-03-05-008 |
| Date | 2026-03-05 |
| Summary | Added month-end readiness audit job with integrity-risk checks (orphaned locked calculations, stale approvals, statement generation presence) |
| Impacted Functions | F-11, F-12, F-17, F-18 |
| Change Type | observability, workflow |
| Expected Effect | enhancement (repeatable E3 dry-run evidence and early detection of month-end blockers) |
| Required Validation | Diagnostics clean; execute audit job and verify reconciliation log + alert severity reflects findings |
| Gap Impact | Advances T5 operational readiness and production cutover confidence |
| SoT Sections Updated | Production MVP Exit Checklist, Function Impact Record Log |
| Decision | Approved and implemented (instance run pending) |

| Field | Value |
|---|---|
| Change ID | FIR-2026-03-05-009 |
| Date | 2026-03-05 |
| Summary | Build-time architecture hardening: added missing readiness/approval system properties and completed static wiring validation for server↔fluent dependencies |
| Impacted Functions | F-11, F-12, F-14, F-17, F-18 |
| Change Type | observability, workflow, access control |
| Expected Effect | enhancement (deploy-time configurability and reduced runtime drift risk) |
| Required Validation | Diagnostics clean on touched files; run build/deploy in instance workspace and execute readiness jobs |
| Gap Impact | Strengthens T4/T5 gate reliability for production MVP exit checks |
| SoT Sections Updated | Function Impact Record Log |
| Decision | Approved and implemented |

| Field | Value |
|---|---|
| Change ID | FIR-2026-03-05-010 |
| Date | 2026-03-05 |
| Summary | Added consolidated architecture integrity check job with required component validation (tables, roles, properties, modules, jobs) |
| Impacted Functions | F-14, F-17, F-18 |
| Change Type | observability, workflow |
| Expected Effect | enhancement (single-source architecture posture evidence for build governance) |
| Required Validation | Diagnostics clean; execute architecture integrity job and verify reconciliation log + alert output |
| Gap Impact | Improves T4/T5 governance reliability and reduces release gate ambiguity |
| SoT Sections Updated | Production MVP Exit Checklist, Function Impact Record Log |
| Decision | Approved and implemented (instance run pending) |

| Field | Value |
|---|---|
| Change ID | FIR-2026-03-05-011 |
| Date | 2026-03-05 |
| Summary | Commission progress dashboard reliability uplift: selected-year alignment for plan header, quota-progress fallback resilience, and accelerator/sub-target visibility improvements |
| Impacted Functions | F-01, F-02, F-07, F-10, F-14 |
| Change Type | workflow, observability |
| Expected Effect | enhancement (UX/data-alignment fixes without core payout math changes) |
| Required Validation | Diagnostics clean on modified UI/script-include files; verify selected-year display, quota rows render for target/fallback paths, and tier-progress context shows current/next accelerator cues |
| Gap Impact | Advances T4 usability and improves AE demo gate reliability for progress page evidence |
| SoT Sections Updated | Function Impact Record Log |
| Decision | Approved for implementation |

| Field | Value |
|---|---|
| Change ID | FIR-2026-03-05-012 |
| Date | 2026-03-05 |
| Summary | Added monthly won-commissions trend representation to commission progress dashboard (selected-year, representative-scoped) |
| Impacted Functions | F-05, F-10, F-14, F-17 |
| Change Type | workflow, observability |
| Expected Effect | enhancement (new reporting visualization; no commission calculation behavior changes) |
| Required Validation | Diagnostics clean; selected-year dashboard shows month-by-month won commission totals; empty-state renders cleanly when no data |
| Gap Impact | Advances T4 usability and strengthens AE demo evidence quality for progress-page comprehension |
| SoT Sections Updated | Function Impact Record Log |
| Decision | Approved for implementation |

| Field | Value |
|---|---|
| Change ID | FIR-2026-03-05-013 |
| Date | 2026-03-05 |
| Summary | Commission progress UI cleanup: remove redundant top summary card, promote quota/OTE cards, and ensure quota-progress renders all plan-applicable deal types |
| Impacted Functions | F-01, F-10, F-14 |
| Change Type | workflow, observability |
| Expected Effect | enhancement (layout clarity and complete quota-type visibility; no payout behavior changes) |
| Required Validation | Diagnostics clean; top summary card removed; quota/OTE appears in top row; quota progress includes all active plan target deal types |
| Gap Impact | Improves T4 usability and demo readability for AE workflows |
| SoT Sections Updated | Function Impact Record Log |
| Decision | Approved for implementation |

| Field | Value |
|---|---|
| Change ID | FIR-2026-03-05-014 |
| Date | 2026-03-05 |
| Summary | Dead-code elimination in commission progress UI script after card-layout simplification (remove obsolete plan-card renderer and now-unreferenced helpers) |
| Impacted Functions | F-10, F-14 |
| Change Type | workflow |
| Expected Effect | enhancement (maintainability improvement; no runtime behavior change intended) |
| Required Validation | Diagnostics clean; no references remain to removed functions/elements; dashboard loads without JS errors |
| Gap Impact | Supports T4 stability by reducing UI script drift and maintenance risk |
| SoT Sections Updated | Function Impact Record Log |
| Decision | Approved for implementation |

## KPIs
- Reproducible calculations from persisted snapshots: target 100%
- Core UI checklist critical pass rate: target 100%
- Statement approval turnaround: target <48h
- Dispute SLA attainment (post-dispute module): target >95%
- Forecast month-end variance (post calibration): target <10%
- Critical data integrity exceptions per run: target 0
