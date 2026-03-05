# Core UI Test Checklist (Pre-Finance Cockpit)

Use this checklist to validate base relationships and core workflows before building Finance Mission Control.

## 0) Preconditions
- Ensure latest app metadata is deployed.
- Ensure at least one admin user and one rep user exist.
- Ensure `deal_types` records exist for all codes used in tests.
- Ensure no stale tier records without ceiling (new model requires explicit floor + ceiling).

## 1) Data Model Relationship Sanity

### 1.1 Plan hierarchy relationships
- Create a new Commission Plan.
- Add Plan Targets linked to the plan.
- Add Plan Tiers linked to the same plan.
- Add Plan Bonuses linked to the same plan.
- Verify related lists show all child records under the plan form.

### 1.2 Tier band integrity
- Create tiers with explicit non-overlapping ranges, e.g.:
  - 0–100 at 4.5%
  - 101–120 at 5.5%
  - 121–999999 at 7.0%
- Confirm overlapping tier insert fails with validation error.
- Confirm missing ceiling fails validation.

### 1.3 Deal classification relationships
- For one deal, add multiple `deal_classifications` rows (e.g., `referral_deal`, `seller_sourced`).
- Set one as primary and ordered priority.
- Confirm records are persisted and visible.

## 2) Core Plan Setup UX

### 2.1 Add a full plan from UI
- Create plan header (rep, active dates, rates).
- Add targets per deal type.
- Add tier bands (including accelerator bands >100%).
- Add bonus rules (structured metric/operator/threshold/period).
- Confirm save succeeds with no client/server errors.

### 2.2 Tier/accelerator display
- Open Commission Progress page.
- Verify tier markers show on progress bars.
- Verify current tier label and rate appear.
- Verify accelerator status appears when threshold reached.

## 3) Open Deals Tracking + Progress

### 3.1 Open deals feed
- Create/open multiple deals with different stages and deal types.
- Confirm they show in Open Deals table on progress UI.
- Confirm pipeline amount totals match table sums.

### 3.2 Quota progress and attainment
- Mark selected deals won to drive attainment.
- Verify quota progress updates by deal type.
- Verify plan card attainment reflects quota progress (not commission-earned %).

## 4) Calculation Runtime (Core Correctness)

### 4.1 Single classification
- Run payment-to-calculation for a deal with one classification.
- Verify commission calculation record created.
- Verify `effective_tier_name`, `commission_rate`, explainability fields populated.

### 4.2 Multi classification (highest applies)
- Use a deal with multiple classification mappings.
- Trigger calculation.
- Verify selected applied classification is highest-rate candidate.
- Verify calculation inputs JSON includes candidate evaluations and selection model.

### 4.3 Marginal tier math
- Use test data crossing a tier threshold within same deal/payment scenario.
- Verify payout reflects marginal band logic (not full-base top rate).
- Verify base vs accelerator delta explainability values are sensible.

## 5) Bonus Engine Basics

### 5.1 Structured bonus qualification
- Create at least one non-discretionary bonus condition.
- Trigger calculation where condition should pass.
- Verify `bonus_earnings` row created and bonus component added.

### 5.2 One-time-per-period bonus
- Re-run qualifying scenario in same period.
- Verify duplicate bonus does not re-earn when `one_time_per_period = true`.

## 6) Statements + Explainability

### 6.1 Statement generation
- Run statement generation job.
- Verify statement totals and component rollups are populated.

### 6.2 Drill-down
- Open statement explainability page.
- Confirm line-item breakdown includes base/accelerator/bonus and ties to calculations.

## 7) Access & Permissions
- Rep can view only own progress/calculations/statements.
- Manager/admin/finance access behaves per ACLs.
- Admin can manage plan/tier/classification configuration.

## 8) Exit Criteria Before Finance Cockpit
- Plan setup UI works end-to-end with targets, explicit tiers, and bonuses.
- Open deals and quota tracking are accurate and stable.
- Calculation runtime supports single + multi classification deterministically.
- Marginal tier payout and explainability fields validate against expected outputs.
- Statement generation + explainability drill-down are consistent.

---

## Suggested Test Data Pack (Minimal)
- 2 reps, 2 active plans, 6 tiers total, 3 bonuses.
- 10 deals (mixed types/stages), 4 invoices, 4 payments.
- At least 2 deals with multiple classifications.
- One scenario crossing 100% and one crossing 120% attainment.
