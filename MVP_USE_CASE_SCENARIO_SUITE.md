# MVP Use-Case Scenario Suite (Programmatic Architecture Validation)

> **Tracking note (2026-03-05):** This file is execution/test reference only. Canonical backlog, phase status, and release tracking live in [GAP_ASSESSMENT.md](GAP_ASSESSMENT.md).

This suite is derived from current implementation state in [GAP_ASSESSMENT.md](GAP_ASSESSMENT.md), table metadata under `src/fluent/tables`, business rules under `src/server/business-rules`, and deployed UI pages wired in [src/fluent/index.now.ts](src/fluent/index.now.ts).

## 1) Scope and MVP Definition

### In scope for MVP sign-off
- Deterministic commission calculation with tiered rates and explainability.
- Plan configuration flows (targets, tiers, bonuses, recognition policies).
- Classification-aware logic (many-to-many deal classifications, highest applicable rate behavior).
- Forecast/estimator baseline for reps.
- Statement generation + approval workflow baseline.
- Access control behavior for rep/manager/finance/admin personas.

### Out of scope (post-MVP)
- Full finance cockpit UX.
- Full dispute case workspace with threaded commentary + SLA automation.
- Multi-currency modeling and FX snapshots.

---

## 2) Architecture Under Test

### Primary table graph
- `x_823178_commissio_commission_plans` (parent)
  - `x_823178_commissio_plan_targets` (1:N)
  - `x_823178_commissio_plan_tiers` (1:N)
  - `x_823178_commissio_plan_bonuses` (1:N)
  - `x_823178_commissio_plan_recognition_policies` (1:N)
- `x_823178_commissio_deals` (parent)
  - `x_823178_commissio_deal_classifications` (1:N)
  - `x_823178_commissio_invoices` (logical link by external deal mapping)
  - `x_823178_commissio_commission_calculations` (via payment runtime)
- `x_823178_commissio_commission_calculations`
  - `x_823178_commissio_bonus_earnings` (1:N)
  - `x_823178_commissio_commission_statements` (many calcs to one statement)
  - `x_823178_commissio_statement_approvals` (workflow events)

### Primary UI surfaces
- Rep/Mgr performance: [src/fluent/ui-pages/commission-progress.now.ts](src/fluent/ui-pages/commission-progress.now.ts)
- Plan relationship explorer: [src/fluent/ui-pages/plan-structure-hierarchy.now.ts](src/fluent/ui-pages/plan-structure-hierarchy.now.ts)
- Ops dashboard: [src/fluent/ui-pages/commission-dashboard-redesigned.now.ts](src/fluent/ui-pages/commission-dashboard-redesigned.now.ts)

---

## 3) Scenario Suite (Use Cases + Programmatic Assertions)

## UC-01 Plan setup end-to-end
**Goal:** Validate parent-child plan structure is complete and navigable.

- **Setup tables:** `commission_plans`, `plan_targets`, `plan_tiers`, `plan_bonuses`, `plan_recognition_policies`
- **UI path:** Plan form + hierarchy page (`x_823178_commissio_plan_hierarchy.do?sysparm_plan_id=<plan_sys_id>`)
- **Action:** Create a plan, then add at least 2 targets, 3 tiers, 1 bonus, 1 recognition policy.
- **Programmatic assertions:**
  - Child rows exist for the same `commission_plan` sys_id.
  - All child rows have `is_active=true` where applicable.
  - Hierarchy page links resolve to filtered lists for each child table.
- **Pass criteria:** No orphaned rows; hierarchy renders all configured child domains.

## UC-02 Tier band governance (explicit + contiguous)
**Goal:** Ensure tier model integrity matches runtime expectations.

- **Setup tables/rules:** `plan_tiers`, `plan-tier-validation.js`
- **Action:**
  1. Attempt overlap (e.g., `0–100`, `90–120`).
  2. Attempt gap (e.g., `0–100`, `110–130`).
  3. Attempt missing start at `0`.
- **Programmatic assertions:**
  - Overlap save is blocked.
  - Gap save is blocked.
  - Non-zero first floor is blocked.
  - Allowed scopes normalize to governed set (`all/new_business/renewal/expansion/upsell`).
- **Pass criteria:** Only contiguous, non-overlapping bands starting at `0%` are accepted per scope.

## UC-03 Deal classification governance
**Goal:** Prevent mapping drift and enforce a deterministic primary classification baseline.

- **Setup tables/rules:** `deal_classifications`, `deal-classification-validation.js`
- **Action:**
  1. Create duplicate classification for same deal/type.
  2. Create two rows marked `is_primary=true` for same deal.
  3. Create first classification with `is_primary=false`.
- **Programmatic assertions:**
  - Duplicate type per deal is blocked.
  - Multiple primaries per deal are blocked.
  - First classification auto-normalizes to one primary when none exists.
  - `deal_type` values are normalized aliases.
- **Pass criteria:** One active primary max; no duplicate deal-type mapping per deal.

## UC-04 Classification-aware quota progress
**Goal:** Verify quota/progress uses classification mapping, not stale raw deal type.

- **Setup tables/code:** `deals`, `deal_classifications`, progress helper methods
- **UI path:** Progress page by rep and manager rollup mode.
- **Action:** Create won deals where `deals.deal_type` differs from primary classification mapping.
- **Programmatic assertions:**
  - Quota achieved amounts aggregate under resolved classification.
  - Progress bars and type breakdown reflect mapped values.
  - Aggregate rollup path and single-rep path produce consistent totals.
- **Pass criteria:** No divergence between mapping table and progress math outputs.

## UC-05 Runtime effective rate selection (highest applicable)
**Goal:** Confirm multi-classification deals choose highest applicable effective rate.

- **Setup tables/code:** `deal_classifications`, `plan_tiers`, `payment-commission.js`
- **Action:** Use one deal with at least two active classifications whose scoped tiers produce different rates.
- **Programmatic assertions:**
  - Calculation input snapshot stores candidate list + chosen model.
  - Chosen rate equals max evaluated effective rate.
  - Persisted fields (`effective_tier_name`, `commission_rate`, `accelerator_applied`) match snapshot.
- **Pass criteria:** Deterministic highest-applicable selection is reproducible from stored snapshot.

## UC-06 Marginal band payout correctness
**Goal:** Validate commission amount uses marginal math across attainment bands.

- **Setup tables/code:** `plan_tiers`, `commission_calculations`, `payment-commission.js`
- **Action:** Trigger scenario crossing at least one boundary in-period.
- **Programmatic assertions:**
  - `commission_amount` equals sum of marginal slices.
  - `base_component + accelerator_component + bonus_component == commission_amount` (within rounding tolerance).
  - `payoutComputationMode` snapshot indicates marginal mode.
- **Pass criteria:** No top-band-over-full-base behavior.

## UC-07 Structured bonus execution
**Goal:** Validate bonus rules run deterministically and persist earned records.

- **Setup tables/code:** `plan_bonuses`, `bonus_earnings`, runtime bonus evaluator
- **Action:** Configure one qualifying bonus and one non-qualifying bonus in same run.
- **Programmatic assertions:**
  - Qualifying bonus creates `bonus_earnings` row linked to calculation.
  - Non-qualifying bonus does not create earned record.
  - Bonus explainability appears in calculation/statement payloads.
- **Pass criteria:** Bonus outcomes are deterministic and auditable.

## UC-08 One-time bonus dedupe
**Goal:** Ensure one-time-per-period bonus cannot be re-earned in same period.

- **Setup tables:** `bonus_earnings`
- **Action:** Re-run same qualifying transaction in same period for one-time bonus.
- **Programmatic assertions:**
  - Second run does not create duplicate earned row.
  - Commission bonus component does not increase on rerun.
- **Pass criteria:** One-time guardrail prevents duplicate payout.

## UC-09 Recognition policy temporal behavior
**Goal:** Confirm calculation date lookup honors policy basis by effective dates.

- **Setup tables/code:** `plan_recognition_policies`, `payment-commission.js`, policy validation rule.
- **Action:** Run equivalent transactions under each basis (`cash_received`, `invoice_issued`, `booking`, `milestone`).
- **Programmatic assertions:**
  - `recognition_basis_snapshot` matches active policy basis.
  - `temporal_lookup_date_snapshot` aligns with basis semantics.
  - `payout_eligible_date` derivation is consistent with basis/schedule snapshot.
- **Pass criteria:** Policy swaps are deterministic and historically reproducible.

## UC-10 Statement generation and workflow baseline
**Goal:** Validate statement totals and approval lifecycle minimum path.

- **Setup tables/code:** `commission_statements`, `statement_approvals`, monthly job + approval BR.
- **Action:** Generate statement, submit approval, approve/reject transitions.
- **Programmatic assertions:**
  - Statement total equals sum of linked calculation amounts.
  - Status transitions are enforced by workflow rule.
  - Approval records preserve actor/timestamp/status evidence.
- **Pass criteria:** Finance can process statements with auditable state changes.

## UC-11 Forecast and estimator baseline
**Goal:** Validate forecast engine and estimator return coherent outputs for rep planning.

- **Setup tables/code:** `forecast_scenarios`, progress helper forecast methods.
- **UI path:** Forecast + estimator sections on progress page.
- **Action:** Save scenario with multipliers; run estimator for a future close-date deal.
- **Programmatic assertions:**
  - Scenario record persists projected revenue/commission/attainment.
  - Estimator output includes tier, rate, expected payout, recognition basis/date projections.
  - Deal-type rate lookup uses classification-resolved type.
- **Pass criteria:** Forecast/estimator outputs are persisted, explainable, and classification-aware.

## UC-12 Role-based visibility contract
**Goal:** Verify rep, manager, finance, and admin can only access intended surfaces/data.

- **Setup tables/code:** ACLs, manager memberships, progress helper scope logic.
- **Action:** Evaluate same data set under each role.
- **Programmatic assertions:**
  - Rep sees own data only.
  - Manager sees governed team rollups.
  - Finance/admin see required global records.
  - Restricted write attempts are denied by ACL/rules.
- **Pass criteria:** No unauthorized read/write exposure for commission-sensitive records.

---

## 4) Execution Order (Fastest Signal to MVP)

1. **Integrity first:** UC-01, UC-02, UC-03
2. **Calc correctness:** UC-04, UC-05, UC-06
3. **Payout modifiers:** UC-07, UC-08, UC-09
4. **Operational flow:** UC-10, UC-11, UC-12

If any scenario in phase 1 or 2 fails, pause downstream testing and fix root-cause before proceeding.

---

## 5) MVP Exit Gate (Definition of Done)

MVP is considered achieved when:
- UC-01 through UC-06 all pass with no data integrity exceptions.
- At least one successful run each for UC-07 to UC-10 with auditable persisted evidence.
- UC-11 outputs are stable across two scenario reruns with identical inputs.
- UC-12 confirms role visibility constraints for all four personas.

---

## 6) Next Steps to MVP (from this suite)

### Immediate (this sprint)
- Execute UC-01..UC-06 and log evidence IDs (plan, deal, calc, statement sys_ids).
- Patch any failed deterministic logic before adding new UX scope.

### MVP completion sprint
- Execute UC-07..UC-12 with role-based test runs.
- Produce a short MVP sign-off report containing pass/fail, defect links, and required fixes.

### First post-MVP uplift
- Implement dispute case workspace and finance cockpit queue UX as phase-2 operational layer.
- Start multi-currency domain design once deterministic MVP baseline is signed.
