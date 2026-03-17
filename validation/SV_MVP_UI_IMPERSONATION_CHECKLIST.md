# ServiceNow UI + Impersonation Checklist (SV-01..SV-06 Support)

This checklist covers UI flows and persona verification that should be validated in-session (not only with server-side assertions).

Test date baseline:
- Current run date: 2026-03-17

## Personas

Use one test user per persona:

1. `REP_USER` with `x_823178_commissio.rep`
2. `MANAGER_USER` with `x_823178_commissio.manager`
3. `FINANCE_USER` with `x_823178_commissio.finance`
4. `ADMIN_USER` with `x_823178_commissio.admin`

## Navigation Smoke (Required)

For each persona session:

1. Open `x_823178_commissio_dashboard.do`
2. Open `x_823178_commissio_progress.do`
3. Open `x_823178_commissio_statement_explainability.do`
4. Confirm menu links for Dashboard and My Progress are visible and not broken

## SV-01 UI Validation (Plan Setup)

As `ADMIN_USER`:

1. Create commission plan from form.
2. Add related list records:
   - at least one target
   - at least three tiers with contiguous bands
3. Attempt invalid tier actions:
   - overlap
   - gap
   - non-zero first floor
4. Capture blocked validation messages.

Expected:
- Valid hierarchy saves.
- Invalid tier configurations are blocked.

## SV-02 UI Validation (Snapshot)

As `ADMIN_USER`:

1. Open test deal and move stage to `closed_won`.
2. Confirm snapshot fields are populated on form.
3. Attempt to change `owner_at_close` or `close_date` without approved exception.

Expected:
- Snapshot fields set.
- Post-snapshot mutation blocked.

## SV-03 UI Validation (Payment Runtime)

As `ADMIN_USER`:

1. Insert payment record linked to mapped invoice.
2. Refresh and inspect payment status + linked calculation.
3. Open linked calculation and inspect key values.
4. Repeat with refund payment.

Expected:
- Calculation is created (or pending/error in explicit exception scenarios).
- Refund path yields negative commission.

## SV-04 UI Validation (Explainability Surfaces)

As `ADMIN_USER`:

1. Open calculation record from SV-03.
2. Verify explainability fields populate:
   - effective tier
   - commission rate
   - base/accelerator/bonus components
3. Open statement explainability page for the representative and verify line-item breakdown.
4. Open progress page and verify tier/progress context appears for selected year.

Expected:
- Component-level explainability is visible and coherent across pages.

## SV-05 UI Validation (Role and Scope)

As `REP_USER`:

1. Open My Progress.
2. Confirm only own data appears.
3. Confirm no user selector for other reps.

As `MANAGER_USER`:

1. Open My Progress.
2. Confirm team rollup/selection works only for managed reps.
3. Confirm non-managed rep access is denied.

As `FINANCE_USER`:

1. Open My Progress and statement screens.
2. Confirm broader read visibility works.
3. Confirm finance-only write behavior aligns to statement status operations.

As `ADMIN_USER`:

1. Confirm full configuration and visibility access.
2. Confirm representative selector and cross-user views work.

Expected:
- No data leakage.
- Access aligns with role model.

## SV-06 UI Validation (Exceptions and Controls)

As `ADMIN_USER`:

1. Attempt duplicate payment/deal identifiers where applicable.
2. Confirm duplicate-prevention errors surface in UI.
3. Open exception approvals, system alerts, reconciliation log lists.
4. Confirm new entries appear after control events and reconciliation run.

Expected:
- Guardrails are visible to operators.
- Operational artifacts are traceable in UI tables.

## Evidence Table

| Suite | Persona | Result | Screenshot IDs | Record sys_ids | Notes |
|---|---|---|---|---|---|
| SV-01 | Admin |  |  |  |  |
| SV-02 | Admin |  |  |  |  |
| SV-03 | Admin |  |  |  |  |
| SV-04 | Admin |  |  |  |  |
| SV-05 | Rep |  |  |  |  |
| SV-05 | Manager |  |  |  |  |
| SV-05 | Finance |  |  |  |  |
| SV-05 | Admin |  |  |  |  |
| SV-06 | Admin |  |  |  |  |
