# ServiceNow ATF Blueprint (SV-01..SV-06)

This file defines the ATF tests to implement for the minimal commission-tracking MVP assessment.

Notes:
- Build these under one ATF suite, for example `SV Minimal Commission Tracking MVP`.
- Use dedicated records with prefix `SV_MVP_` so cleanup and evidence are easy.
- `SV-05` role impersonation remains manual because persona behavior and navigation checks are easier to verify with explicit user sessions.

## Suite: SV Minimal Commission Tracking MVP

| Test ID | Suite Mapping | Purpose |
|---|---|---|
| ATF-SV01-001 | SV-01 | Create valid plan hierarchy (plan + target + contiguous tiers) |
| ATF-SV01-002 | SV-01 | Block overlapping tiers |
| ATF-SV01-003 | SV-01 | Block tier gaps / non-zero first floor |
| ATF-SV02-001 | SV-02 | Snapshot fields set when stage moves to `closed_won` |
| ATF-SV02-002 | SV-02 | Post-snapshot mutation blocked without approved exception |
| ATF-SV03-001 | SV-03 | Payment insert creates linked calculation |
| ATF-SV03-002 | SV-03 | Refund creates negative commission |
| ATF-SV04-001 | SV-04 | Multi-classification selects highest applicable effective rate |
| ATF-SV04-002 | SV-04 | Marginal payout explainability components reconcile to total |
| ATF-SV06-001 | SV-06 | Duplicate payment ID blocked |

## ATF-SV01-001: Valid Plan Hierarchy

1. Insert commission plan with active rep + effective dates.
2. Insert plan target linked to that plan + active deal type reference.
3. Insert tiers for same target with contiguous bands:
   - `0-100`
   - `100-120`
   - `120-200`
4. Assert records insert successfully.
5. Server-side assertion step:
   - active target count for plan > 0
   - active tier count for target > 0

## ATF-SV01-002: Overlap Blocking

1. Use existing valid target from `ATF-SV01-001`.
2. Attempt insert of overlapping tier range (for example `90-130`).
3. Assert save is blocked with overlap validation message.

## ATF-SV01-003: Gap and Start-Floor Governance

1. Attempt tier insert where first floor is not `0`.
2. Attempt tier insert that creates a gap between previous ceiling and next floor.
3. Assert each insert is blocked with expected governance message.

## ATF-SV02-001: Snapshot on Close Won

1. Insert deal with non-closed stage and required fields.
2. Update stage to `closed_won`.
3. Assert:
   - `snapshot_taken = true`
   - `snapshot_timestamp` not empty
   - `snapshot_immutable = true`
   - `owner_at_close` populated

## ATF-SV02-002: Snapshot Immutability

1. Use snapshotted deal from `ATF-SV02-001`.
2. Attempt update to `owner_at_close` or `close_date` with no approved exception row.
3. Assert update is blocked.

## ATF-SV03-001: Payment Creates Calculation

1. Insert mapped invoice for a won/snapshotted deal.
2. Insert payment linked to invoice.
3. Wait/poll briefly for after-BR processing.
4. Assert:
   - payment `commission_calculated = calculated` (or expected pending/error in edge case)
   - `commission_calculation_id` populated for calculated path
   - referenced calculation exists

## ATF-SV03-002: Refund Negative Entry

1. Insert refund payment (`payment_type = refund` or negative amount).
2. Assert linked calculation `commission_amount < 0` and `is_negative = true`.

## ATF-SV04-001: Highest Applicable Rate

1. Add at least two active classifications for one deal with distinct candidate rates.
2. Trigger payment calculation.
3. Assert from calculation JSON:
   - `rateSelectionModel = highest_applicable_classification`
   - selected effective rate equals highest candidate effective rate

## ATF-SV04-002: Marginal Explainability Reconciliation

1. Trigger scenario that crosses at least one attainment boundary.
2. Assert:
   - `payoutComputationMode = marginal_tier_bands`
   - `base_commission_component + accelerator_delta_component + bonus_component == commission_amount` (tolerance `0.01`)

## ATF-SV06-001: Duplicate Payment Prevention

1. Insert payment with unique `books_payment_id`.
2. Attempt second insert with same `books_payment_id`.
3. Assert duplicate prevention blocks the second insert.

## Manual Complements Required

1. `SV-05` role/impersonation checks are executed from:
   [SV_MVP_UI_IMPERSONATION_CHECKLIST.md](/Users/chris/Git/comms-tracker/commstracker/validation/SV_MVP_UI_IMPERSONATION_CHECKLIST.md)
2. `SV-06` reconciliation artifact checks are validated by running:
   [sv_mvp_background_probes.js](/Users/chris/Git/comms-tracker/commstracker/validation/sv_mvp_background_probes.js)
