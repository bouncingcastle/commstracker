# CommsTracker

Production baseline for the Commission Management application.

## Baseline status
- **Baseline date:** April 17, 2026
- **State:** Ready for production data onboarding
- **Integration posture:** No in-app Zoho/Bigin/Books ingestion APIs

## In-scope features
- Commission data model for:
  - Deals, Invoices, Payments
  - Commission Plans, Plan Targets, Plan Tiers, Plan Bonuses
  - Commission Calculations, Statements, Statement Approvals
  - Forecast Scenarios, Exception Approvals, Monitoring tables
- Automated commission processing and validation through business rules.
- Monthly statement generation (`Generate Monthly Commission Statements`).
- Daily operational reconciliation (`Daily Commission Reconciliation`).
- Month-end readiness auditing (`Commission Month-End Readiness Audit`).
- Architecture/readiness integrity validation (`Commission Architecture Integrity Check`).
- UI experience for:
  - Operations dashboard
  - Sales rep progress dashboard
  - Plan hierarchy and core list/form workflows

## Out of scope (intentionally removed)
- Native Zoho integration endpoints and scripted REST ingestion APIs.
- Demo/sample data loaders.
- Seed/backfill/one-time migration utilities that are not part of ongoing production operations.

## Data onboarding contract
Data is expected to be loaded by an external pipeline/process directly into app tables.

Minimum operational expectations:
- Deals populate `bigin_deal_id` where available.
- Invoices populate `books_invoice_id` and map to deals via `bigin_deal_id`/`deal`.
- Payments populate `books_payment_id` and map to invoices/deals.
- Commission plans and plan structures are configured before payment ingestion.

## Build and deploy commands
- `npm run build`
- `npm run transform`
- `npm run types`
- `npm run deploy`

## Documentation approach
This README is now the consolidated source of truth for production scope.
Historical analysis and implementation notes are kept in existing markdown files in the repository root for reference.
