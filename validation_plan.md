# Commission System Validation Plan

## Phase 1 — Core Calculation Engine (highest risk)
**Target:** `src/server/business-rules/payment-commission.js` (~1,510 lines)

| # | Check | Status | Findings |
|---|-------|--------|----------|
| 1.1 | Payment ratio math (partial, over, zero, refund) | ✅ | Capped at 1.0 via `Math.min`. Zero/negative invoices rejected early. Overpayment >120% warned, not blocked. Uses `Math.abs(paymentAmount)` for ratio so refund magnitude is correct. Commission base uses subtotal (pre-tax). Solid. |
| 1.2 | Tier band selection (boundary conditions) | ✅ | `resolveTierForAttainment`: floor inclusive (`>=`), ceiling inclusive (`<=`). Above all tiers → falls back to highest eligible tier. Gap between bands → highest eligible tier used for metadata. Marginal calculation handles gaps separately (applies baseRate to uncovered %). |
| 1.3 | Marginal vs. flat rate application | ✅ | `calculateMarginalCommissionAmount` correctly applies weighted marginal rates across overlapping bands. Uncovered gaps use baseRate. `payoutComputationMode: 'marginal_tier_bands'` in audit trail. |
| 1.4 | Accelerator delta (no double-count) | ✅ | `base = amount * baseRate`, `effective = marginal calc`, `accelerator = effective - base`. Total = effective + bonus. No double-counting. |
| 1.5 | Bonus qualification logic | ✅ | 4 metrics (quota_attainment, deal_amount, deal_count, base_commission), 3 operators (gt, eq, gte). One-time-per-period enforced. Refunds skip bonuses. Negative bonus amounts forced positive via `Math.abs`. |
| 1.6 | Temporal basis (close_date not current_date) | ✅ | Initial plan lookup uses closeDate. Recognition policy can shift temporal lookup date. If shifted, re-fetches plan at new date. All downstream lookups use resolved date. |
| 1.7 | Recognition policy (4 bases) | ✅ | cash_received: recognize at payment, lookup at close. invoice_issued: recognize at invoice date. booking: recognize at close. milestone: recognize at snapshot. Fallback chain for missing dates. |
| 1.8 | Duplicate prevention window | 🔴 BUG | **Stuck-check logic is inverted.** `stuckCheck` queries for records NEWER than `stuckThreshold` — since `stuckThreshold > lockTimeout`, any record found by `calcLockGr` is always found by `stuckCheck` too. Result: `stuckCheck.next()` always true → always proceeds. **Lock is never enforced.** See fix 1.8 below. |
| 1.9 | Refund / clawback handling | ✅ | Detects refunds via `payment_type === 'refund' || paymentAmount < 0`. Negates commission and components. Sets `is_negative` flag. Bonuses skipped for refunds. |
| 1.10 | Deal type resolution chain | ✅ | Requires `deal_type_ref` on deal (errors if missing). `resolveDealTypeCandidates` gets all classifications + primary type. Evaluates all candidates, picks highest rate. |

### Phase 1 Additional Findings

| # | Check | Status | Findings |
|---|-------|--------|----------|
| 1.11 | `shouldRecalculate` error recovery | 🔴 BUG | References undefined `commissionGr` in ERROR branch — causes ReferenceError, **prevents all error-state recalculations**. See fix 1.11 below. |
| 1.12 | `getTierBandsForDealType` deal type fallback | 🟡 FIX | Uses `normalizeDealTypeKey(dealType) \|\| 'other'` — inconsistent with dashboard fix where empty = match-all. Tiers without plan_target are excluded. Should be consistent with helper's `filterTiersForDealType`. See fix 1.12 below. |
| 1.13 | `bonusScopeMatches` deal type fallback | 🟡 MINOR | Uses `normalizeDealTypeKey(dealType) \|\| 'other'` but unreachable because calc errors out early if deal type is empty. Cosmetic fix for consistency. |
| 1.14 | Quota calculation scope | ℹ️ NOTE | `getPlanQuotaAmount` sums ALL active targets (all deal types). `getRepAttainedAmountBeforeDeal` counts ALL won deals. Attainment is global, not per-deal-type. This is intentional (plan-level quota). |
| 1.15 | `resolveTierForAttainment` vs `filterTiersForDealType` | 🟡 FIX | Server calc uses strict match (`tierDealType === normalizedDealType`). Dashboard helper treats empty as match-all. **Inconsistency**: dashboard shows tiers that calc engine would exclude. See fix 1.12. |

## Phase 2 — Dashboard Data Service (data integrity)
**Target:** `src/fluent/script-includes/commission-progress-helper.now.ts` (~2,200 lines)

| # | Check | Status | Findings |
|---|-------|--------|----------|
| 2.1 | Earnings aggregation (no double-count) | ✅ | No double-counting. All calcs for user/year summed once. Calcs with unexpected status add to totalEarned but not paid/pending buckets (harmless). |
| 2.2 | Quota attainment % (zero/missing targets) | ✅ | Zero target → 0% attainment (design choice). Missing targets → adds achieved deal types with 0 quota. Acceptable. |
| 2.3 | Tier resolution consistency with calc engine | ✅ FIXED | Dashboard `filterTiersForDealType` treats empty as match-all. Calc engine `getTierBandsForDealType` and `resolveTierForAttainment` now also treat empty as match-all (fixed in Phase 1). Consistent. |
| 2.4 | Pending vs. paid classification | ✅ | draft → pending, paid/locked → paid. Correct. |
| 2.5 | Year/period date boundaries | 🟡 FIXED | `calculation_date` is DateTimeColumn but year-end query used date-only string `'2026-12-31'` = midnight, missing all Dec 31 calcs. Fixed: added time suffixes `' 00:00:00'` / `' 23:59:59'`. |
| 2.6 | Forecast/estimator tier math | ℹ️ NOTE | Estimator uses flat rate from single tier (`amount * rate`), actual calc uses marginal weighted rate across bands. Known simplification — estimate will differ from actual payout for cross-tier deals. |
| 2.7 | Deal type normalization consistency | ✅ | Helper inlines same normalization logic and alias table as `deal-type-normalizer.js`. Consistent. |
| 2.8 | Statement explainability reconciliation | ✅ | Components summed from calcs, overridden by stored statement totals. `unexplained_delta` computed for audit. Solid. |

## Phase 3 — Statement Aggregation (payout accuracy)
**Target:** `src/server/scheduled-scripts/monthly-statements.js` (~350 lines)

| # | Check | Status | Findings |
|---|-------|--------|----------|
| 3.1 | Calculation→statement rollup completeness | ✅ | Uses `addPayoutEligibilityFilter` (payout_eligible_date OR payment_date fallback). Status filter: draft+locked. Approval filter correct. Dedup check for existing statements. Calcs linked and locked to statement. |
| 3.2 | Quarterly bonus inclusion (months 3/6/9/12) | ✅ | `getQuarterlyBonusPayout` checks month 3/6/9/12 correctly. Pulls `auto_payout=true` + `payout_frequency=quarterly` bonuses. These are guaranteed quarterly payouts (MBO-style), not per-deal bonuses. Intentional. |
| 3.3 | Statement freeze enforcement | ✅ | Checks for calc modifications within freeze window. Blocks generation unless emergency override. Calcs locked when linked to statement. |
| 3.4 | Payout eligibility date computation | ✅ | Computed in payment-commission.js (days/cycle mode). Statement filters by payout_eligible_date within target month. |
| 3.5 | Mid-month plan change handling | ✅ | Statement sums ALL calcs for rep/month regardless of plan. Each calc already has correct amount from its plan context. |

### Phase 3 Additional Findings

| # | Check | Status | Findings |
|---|-------|--------|----------|
| 3.6 | Month/year extraction from GlideDateTime | 🔴 BUG FIXED | Used `getYear()` and `getMonth()` (deprecated/undocumented) + `monthNumber = month + 1`. ServiceNow's `getMonth()` returns 1-12, so `+1` is OFF BY ONE. Statements targeted wrong month. Fixed: use `getYearLocalTime()` / `getMonthLocalTime()` directly. |

## Phase 4 — Data Integrity & Reconciliation
**Targets:** `src/server/scheduled-scripts/daily-reconciliation.js`, backfill scripts

| # | Check | Status | Findings |
|---|-------|--------|----------|
| 4.1 | Orphan record detection | ✅ | Checks orphaned payments (missing calcs), orphaned calcs (missing payment/deal/rep), unmapped invoices (>2 days old). |
| 4.2 | Payment vs. calc variance detection | ✅ | Recalculates expected commission and compares. $0.01 minor / $100 significant thresholds. |
| 4.3 | Deal type ref backfill correctness | ✅ | `backfill-deal-type-references.js` is READ-ONLY audit despite the name. Does not modify data. Checks 4 tables for invalid/missing refs. |
| 4.4 | Tier ceiling backfill logic | 🟡 NOTE | `backfill-tier-and-deal-classifications.js` auto-fills missing ceilings from next tier's floor (999999 for open-ended). Aggressive — overwrites any ceiling ≤ floor. Also promotes first classification to primary by creation order (not priority). |

### Phase 4 Additional Findings

| # | Issue | Severity | Details |
|---|-------|----------|---------|
| 4.5 | Auto-remediation in daily-reconciliation | 🟡 RISK | Auto-resets orphaned payment status to `pending` (could loop), auto-marks older duplicate calcs as `error` (could discard correct records). Should flag for manual review instead. |
| 4.6 | Primary classification promotion order | 🟡 NOTE | `backfillTierAndDealClassifications` promotes first classification by sys_created_on, not by priority field. May select wrong type. |

## Phase 5 — Business Rule Consistency
**Targets:** All 14 business rules

| # | Check | Status | Findings |
|---|-------|--------|----------|
| 5.1 | Plan overlap detection (edge cases) | 🟡 FIXED | Same-day boundary not detected (strict `<` instead of `<=`). Case 2 (bounded vs open-ended) logic was wrong — used start comparison instead of end comparison. Fixed: all cases use inclusive `!after()` / `!before()` comparisons. |
| 5.2 | Deal snapshot immutability | 🔴 FIXED | Bypass vector: user could clear `snapshot_taken` flag to `false`, modify fields, then re-close. Fixed: added guard preventing `snapshot_taken` from being cleared once set. |
| 5.3 | Deal type governance (deactivation) | ✅ | Checks 5 tables (deals, targets, tiers via targets, bonuses, calculations). Code immutability enforced. Requires exception approval for deprecation. |
| 5.4 | Tier contiguity (no gaps) | ✅ | Half-open interval overlap detection correct. Ceiling = next floor enforced with 0.0001 tolerance. Zero-start required. Well-implemented. |
| 5.5 | Approval workflow state transitions | 🔴 FIXED | Self-approval vulnerability: no check preventing user from approving their own statement. Fixed: added check comparing statement's `sales_rep` against reviewer `gs.getUserID()`. |

### Phase 5 Additional Findings

| # | Issue | Severity | Details |
|---|-------|----------|---------|
| 5.6 | High-value deal gate | ℹ️ BY DESIGN | Flags `requires_finance_approval` but doesn't block save. Commission engine checks this flag before processing. Gate enforcement happens at calc time, not deal save time. |
| 5.7 | Plan supersede cycle detection | 🟡 NOTE | Only detects direct A→B→A cycles. Transitive cycles (A→B→C→A) not detected. Low risk in practice. |
| 5.8 | Workflow history truncation | 🟡 NOTE | Silently truncates to 4000 chars. Could lose audit trail for long-running statements. |

## Phase 6 — External Integration
**Target:** `src/server/rest-apis/zoho-integration.js` (~320 lines)

| # | Check | Status | Findings |
|---|-------|--------|----------|
| 6.1 | Sync idempotency | ✅ | All 3 endpoints (deals, invoices, payments) query by external ID before insert. Existing records updated in-place. No duplicate risk. |
| 6.2 | Field mapping completeness | ✅ | Invoice stores `bigin_deal_id` as text; `mapInvoiceToDeal` business rule resolves to sys_id reference on insert/update. Payment inherits deal via invoice lookup. Chain intact. |
| 6.3 | Error handling (malformed payloads) | 🟡 NOTE | Missing required-field validation (e.g. null `bigin_deal_id`). Silent failures on owner email lookup and invoice→deal lookup. Errors lack record-level context. Low practical risk (Zoho sends well-formed data). |
| 6.4 | Auth/security (injection, auth) | ✅ | Fluent definition sets `authorization: true` and `authentication: true` on all 3 endpoints — platform-enforced auth. GlideRecord parameterized queries prevent injection. No raw SQL. Numeric fields not type-validated but stored as ServiceNow decimal columns (platform coerces). |

## Phase 7 — UI Accuracy
**Targets:** All 4 UI pages

| # | Check | Status | Findings |
|---|-------|--------|----------|
| 7.1 | Number formatting (currency, %) | ✅ | All currency values use `$` + `.toFixed(2)`. Percentages use `%` suffix. Statement explainability has centralized `money()` helper. CSS `tabular-nums` for alignment. |
| 7.2 | Progress bar accuracy | ✅ | Attainment clamped 0-100% via `Math.min(Math.max())`. Trend bars proportionally scaled against max. Tier markers positioned correctly. |
| 7.3 | Deal table completeness | 🟡 FIXED | Open deals table had duplicate column: both "Stage" (plain text) and "Status" (badge) showed `deal.stage`. Removed redundant Status column, updated all colspans from 7→6. |
| 7.4 | Role-based visibility | ✅ | Client-side `hasClientRole()` gates user selector, forecast, estimator. Server-side `resolveViewerAccess()` enforces access. Dashboard admin links rely on ACLs (acceptable). |
| 7.5 | Dead code cleanup | ✅ | All functions utilized. Hidden forecast section intentionally documented. No unreachable code. |
