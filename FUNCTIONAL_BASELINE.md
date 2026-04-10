# Commission Management Functional Baseline

Established: 2026-04-10

Purpose:
- This document captures the current functionality baseline derived from the repository's Markdown documentation and cross-checked against the repo wiring.
- If this document conflicts with `GAP_ASSESSMENT.md`, `GAP_ASSESSMENT.md` remains the canonical source of truth until the conflict is reconciled.

Method used for this baseline:
- Reviewed the primary root-level Markdown documents that describe scope, validation, safeguards, UI, testing, and next steps.
- Reviewed the validation pack under `validation/`.
- Cross-checked the documented functionality against the import graph in `src/fluent/index.now.ts` and the presence of the referenced server/UI modules.

## Baseline Summary

The current baseline is a ServiceNow-based commission management application with a strong implemented MVP core and explicit boundaries around what is still not complete.

What is implemented at baseline:
- Commission plan setup with targets, tiers, bonuses, and recognition policies.
- Deal, invoice, and payment domain model with payment-driven commission calculation.
- Close-won snapshot controls, temporal rate selection, marginal payout logic, refund handling, and duplicate prevention.
- Monthly statement generation, approval workflow, and explainability surfaces.
- Role-based visibility for rep, manager, finance, and admin personas.
- Core operational controls including reconciliation, alerts, and readiness audit jobs.
- Zoho ingestion API endpoints for deals, invoices, and payments.

What is only partial at baseline:
- Forecasting and estimator capabilities exist, but forecast confidence is limited by static heuristic assumptions.
- Dashboard/analytics coverage is solid for core operational views, but advanced analytics maturity is not complete.
- Operational readiness automation exists in the repo, but several release gates still require instance-side execution evidence.

What is not implemented at baseline:
- Finance operations cockpit workspace.
- First-class dispute management domain.
- Threaded commentary and immutable compliance evidence export domain.
- Multi-currency FX snapshot model.
- Advanced analytics maturity beyond core dashboards and reporting surfaces.

Release posture at baseline:
- Controlled demo or pilot: supported.
- Production MVP: not yet approved.

## Source Documents Reviewed

Primary product and status docs:
- `COMMISSION_MANAGEMENT_README.md`
- `BUSINESS_REQUIREMENT_VALIDATION_COMPLETE.md`
- `COMMISSION_INTERFACE_COMPLETE.md`
- `COMMISSION_PROGRESS_GUIDE.md`
- `CRITICAL_SAFEGUARDS_IMPLEMENTED.md`
- `MVP_LOGICAL_TEST_RESULTS.md`
- `MVP_USE_CASE_SCENARIO_SUITE.md`
- `CORE_UI_TEST_CHECKLIST.md`
- `PROGRESS_DASHBOARD_VERIFICATION.md`
- `NEXT_STEPS_IMPLEMENTATION_GUIDE.md`
- `GAP_ASSESSMENT.md`

Validation and execution docs:
- `validation/SV_MVP_EXECUTION_RUNBOOK.md`
- `validation/SV_MVP_ATF_BLUEPRINT.md`
- `validation/SV_MVP_UI_IMPERSONATION_CHECKLIST.md`

## Repo Cross-Check

Documented functionality is materially reflected in the repo wiring:
- `src/fluent/index.now.ts` imports the application menu, roles, ACLs, system properties, core UI pages, scheduled jobs, business rules, script includes, REST APIs, and core tables.
- The key server business rules described in the docs are present under `src/server/business-rules/`.
- The operational jobs described in the docs are present under `src/server/scheduled-scripts/`.
- The documented UI pages are present under `src/fluent/ui-pages/`.

This baseline therefore reflects implemented repo scope, not only documentation intent.

## Implemented Functional Baseline

### 1. Plan Design and Governance

Implemented:
- Commission plans with effective dating.
- Plan targets.
- Tier bands with governance for explicit ranges, contiguous coverage, and overlap prevention.
- Structured bonuses and one-time-per-period dedupe behavior.
- Recognition policies with basis-driven temporal behavior.
- Bulk plan assignment and manager-team governance foundations.

Evidence from docs:
- `GAP_ASSESSMENT.md` marks `F-01`, `F-02`, `F-08`, `F-09`, `F-15`, and `F-16` as implemented.
- `MVP_LOGICAL_TEST_RESULTS.md` marks UC-01, UC-02, UC-07, UC-08, and UC-09 as pass.

### 2. Core Transaction Model

Implemented:
- Deals as the close-date and ownership anchor.
- Invoices mapped to deals.
- Payments as the triggering event for commission calculation.
- Deal classifications with a governed primary classification model.

Business baseline preserved:
- Quota credited on close date.
- Commission paid on cash received date.
- Commission base uses invoice subtotal.
- Commission owner uses snapshotted AE at close.
- One invoice maps to one deal.
- Refunds create negative commission entries.
- Unmapped records route to exceptions.

Evidence from docs:
- `COMMISSION_MANAGEMENT_README.md` and `BUSINESS_REQUIREMENT_VALIDATION_COMPLETE.md` align on these invariants.
- `MVP_LOGICAL_TEST_RESULTS.md` marks UC-03 and UC-04 as pass.

### 3. Calculation Runtime and Explainability

Implemented:
- Payment-driven commission creation.
- Highest-applicable effective rate selection for multi-classification deals.
- Marginal payout math across tier bands.
- Persisted explainability components and calculation snapshots.
- Refund and negative-entry support.
- Duplicate prevention and idempotency controls.

Evidence from docs:
- `GAP_ASSESSMENT.md` marks `F-05`, `F-06`, and `F-07` as implemented.
- `MVP_LOGICAL_TEST_RESULTS.md` marks UC-05 and UC-06 as pass.
- `CRITICAL_SAFEGUARDS_IMPLEMENTED.md` documents idempotency, concurrency, temporal, and precision controls.

### 4. Statements and Approval Workflow

Implemented:
- Monthly statement generation.
- Draft to locked to paid workflow baseline.
- Approval tracking and status synchronization.
- Statement explainability drill-down.

Evidence from docs:
- `GAP_ASSESSMENT.md` marks `F-11`, `F-12`, and `F-13` as implemented.
- `MVP_LOGICAL_TEST_RESULTS.md` marks UC-10 as pass.

### 5. Access Control and User Surfaces

Implemented:
- Rep, manager, finance, and admin role model.
- Governed visibility by persona and team scope.
- Dashboard UI page.
- Rep progress UI page.
- Statement explainability page.
- Plan hierarchy explorer.

Evidence from docs:
- `COMMISSION_INTERFACE_COMPLETE.md` and `COMMISSION_PROGRESS_GUIDE.md` describe the UI surfaces.
- `MVP_LOGICAL_TEST_RESULTS.md` marks UC-12 as pass.
- Repo cross-check confirms the UI pages are wired in `src/fluent/index.now.ts`.

### 6. Integration and Operational Controls

Implemented in repo:
- Zoho sync REST endpoints for deals, invoices, and payments.
- Reconciliation and alerting jobs.
- Architecture integrity, production readiness, and month-end readiness scheduled checks.
- Monitoring and exception-oriented tables.

Implemented but still requiring operational evidence:
- Instance-side execution of readiness checks.
- Production release gating based on dry-run and UAT evidence.

Evidence from docs:
- `COMMISSION_MANAGEMENT_README.md` documents the ingestion endpoints.
- `GAP_ASSESSMENT.md` marks `F-17` and `F-18` as implemented.
- The same file keeps T5 open because execution evidence is still pending.

## Partial-Strong Baseline Areas

### Forecasting and Estimation

Status:
- Implemented as a baseline capability.
- Not yet strong enough to be treated as high-confidence finance forecasting.

Reason:
- `MVP_LOGICAL_TEST_RESULTS.md` marks UC-11 as `PARTIAL (Risk)`.
- The known gap is static stage-probability heuristics rather than receipt-calibrated forecasting.

Practical baseline statement:
- Forecasting and estimator surfaces are available for user guidance and scenario planning.
- They should not be treated as the same confidence tier as deterministic payout calculations.

### Reporting and Analytics

Status:
- Core dashboards and role-based operational visibility are available.
- Advanced analytics maturity remains open.

Reason:
- `GAP_ASSESSMENT.md` marks analytics maturity work under `F-24` as open.

### Operational Readiness

Status:
- Readiness automation is present in the codebase.
- Production readiness is still incomplete.

Reason:
- `GAP_ASSESSMENT.md` explicitly states current verdict: No-Go for production MVP, Go for controlled demo or pilot.
- Exit items E1 through E5 remain pending.

## Explicitly Open Functional Areas

These remain outside the established functional baseline:

| Function ID | Area | Status |
|---|---|---|
| F-19 | Finance cockpit queue workspace | Open |
| F-20 | Dispute case lifecycle | Open |
| F-21 | Threaded commentary | Open |
| F-22 | Immutable event journal and evidence exports | Open |
| F-23 | Multi-currency FX model | Open |
| F-24 | Advanced analytics maturity | Open |

## Baseline Verdict

The commission application has an implemented and coherent MVP core for:
- plan setup,
- governed tier and classification logic,
- payment-driven commission runtime,
- statement workflow,
- role-based visibility,
- and operational monitoring foundations.

The current functionality baseline should therefore be treated as:
- Functionally strong for deterministic commission administration and controlled business use.
- Partially complete for forecasting and analytics.
- Not yet complete for finance cockpit, disputes, compliance export, multi-currency, and production-readiness evidence.

## Maintenance Rule

When status changes:
- Update this file for baseline changes.
- Update `GAP_ASSESSMENT.md` for track, roadmap, and release-state changes.
- If a change affects function status, keep the function IDs and wording aligned across both files.