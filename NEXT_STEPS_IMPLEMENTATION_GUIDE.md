# LLM Coding Tracker (Execution Guide)

> **Use case:** Primary working tracker for LLM-assisted coding sessions.
> **Canonical alignment:** Status must always match [GAP_ASSESSMENT.md](GAP_ASSESSMENT.md).

## 1) Working Rules (Non-Negotiable)
- Every coding request must map to one or more Function IDs (`F-xx`) in `GAP_ASSESSMENT.md`.
- No change is “done” without validation evidence.
- If scope changes, update this tracker first, then code.
- If this file conflicts with `GAP_ASSESSMENT.md`, update this file immediately.

## 2) Current Priority Stack
1. Stabilize and validate T4 caveat closure (menu reconciliation + role-nav checks)
2. Execute T5 readiness checks (integration/runbook/monitoring)
3. Build T6 (Finance cockpit)
4. Build T7/T8 (dispute/compliance + enterprise scale)

## 3) Active LLM Queue
| Task ID | Title | Function IDs | Track | Status | Acceptance Gate | Evidence |
|---|---|---|---|---|---|---|
| LLM-001 | Complete menu remediation M4/M5 | F-14, F-17 | T4 | Ready | Reconcile clean + role-nav smoke pass | Pending |
| LLM-002 | Operational readiness pack | F-18, F-11, F-17 | T5 | Backlog | Checklist closure + runbook proof | Pending |
| LLM-003 | Finance cockpit foundation | F-19, F-12, F-13 | T6 | Backlog | Queue workflow and SLA throughput test | Pending |
| LLM-004 | Dispute domain MVP | F-20, F-21 | T7 | Backlog | open→resolve→reopen + ACL validation | Pending |
| LLM-005 | Compliance journal/export baseline | F-22 | T7 | Backlog | Immutability checks + export sample accepted | Pending |
| LLM-006 | Multi-currency architecture baseline | F-23 | T8 | Backlog | FX snapshots + reconciliation scenarios | Pending |
| LLM-007 | Schema hardening (types + indexes) | F-01, F-04, F-05, F-07, F-08, F-09, F-11, F-17, F-18 | T2/T3 | In Review | Modified-file error scan + runtime regression sanity | Implemented; awaiting broader regression |
| LLM-008 | Lifecycle/versioning governance uplift | F-01, F-09, F-11, F-12, F-13, F-19 | T2/T6 | In Review | Diagnostics clean + approval flow sanity + queue field readiness | Implemented; validation evidence pending |
| LLM-009 | Runtime lifecycle validation guards | F-01, F-09, F-12, F-19 | T2/T6 | In Review | Diagnostics clean + negative-case insert/update validation | Implemented in business-rule validators |
| LLM-010 | AE demo readiness pack (M4/M5) | F-10, F-14, F-17 | T4/T5 | Ready | Role-nav smoke + AE progress page go/no-go checklist complete | Checklist added; execution pending in instance |

Status values: `Backlog` | `Ready` | `In Progress` | `Blocked` | `In Review` | `Done`

## 4) Task Intake Template (Use Before Coding)
Copy/paste for each new request:

```md
### Task Intake: <TASK ID>
- Request summary:
- Function IDs impacted (F-xx):
- Change type: behavioral | data model | workflow | access control | integration | observability
- Expected effect: no functional change | enhancement | deprecation | breaking
- Files likely impacted:
- Required validations (UC/checklist/tests):
- Gap/track impact (T1–T8):
- Risks:
- Definition of done:
```

## 5) Validation Checklist (Definition of Done)
- [ ] Code change implemented and scoped correctly
- [ ] Function IDs confirmed and unchanged/updated in `GAP_ASSESSMENT.md`
- [ ] Validation run (targeted first, then broader if needed)
- [ ] Evidence logged in this file (links, outputs, or test notes)
- [ ] Queue status updated
- [ ] Any roadmap impact reflected in `GAP_ASSESSMENT.md`

## 6) Session Log (LLM Run History)
| Date | Session ID | Tasks | Outcome | Notes |
|---|---|---|---|---|
| 2026-03-05 | S-001 | LLM-001 (partial) | In Progress | M3 done (`application-menu` import re-enabled), M4/M5 pending |
| 2026-03-05 | S-002 | LLM-007 | In Review | Converted `deals.close_date` to `DateColumn`, normalized integer counters, added transactional indexes, hardened Zoho date normalization |
| 2026-03-05 | S-003 | LLM-008 | In Review | Added plan/policy lifecycle+version fields, queue-oriented statement/approval indexes, and approval SLA due date defaulting |
| 2026-03-05 | S-004 | LLM-009 | In Review | Added validator guards for lifecycle state ↔ active coherence, positive version enforcement, and supersede-chain integrity checks for plans/policies |
| 2026-03-05 | S-005 | LLM-010 | Ready | Added AE demo minimum-record contract and role/menu smoke runbook for manual instance execution |

## 7) Blockers / Decisions
| Date | Type | Description | Owner | Resolution Target |
|---|---|---|---|---|
| 2026-03-05 | Operational | Need post-deploy navigation reconciliation evidence for M4 | Admin/Ops | Next deploy window |

## 8) Handoff Notes (Human ↔ LLM)
- Always start by updating **Task Intake** and setting queue status.
- Always end by updating **Validation Checklist** and **Session Log**.
- Never close a task without evidence.

## 9) AE Demo Fast-Path (Manual Data Entry Supported)

### 9.1 Minimum Record Contract (per Account Executive)
Create these records manually for each AE you want to demo:

| Required | Table | Minimum fields that must be valid for progress page |
|---|---|---|
| Yes | `x_823178_commissio_commission_plans` | `sales_rep`, `is_active=true`, `effective_start_date` (in demo year), optional `effective_end_date`, `plan_name` |
| Yes | `x_823178_commissio_plan_targets` | At least 1 row linked to the plan with `deal_type`, `annual_target_amount` |
| Yes | `x_823178_commissio_plan_tiers` | At least 1 baseline tier (floor 0) with `commission_rate_percent`; optional accelerator tiers |
| Recommended | `x_823178_commissio_plan_bonuses` | Optional but improves explainability/OTE sections |
| Yes (for attainment) | `x_823178_commissio_deals` | Won deals for the AE in demo year with `amount`, `close_date`, `is_won=true`, owner fields |
| Yes (for pipeline) | `x_823178_commissio_deals` | Open deals for pipeline with `is_won=false`, stage not `closed_lost`, `amount`, `close_date` |
| Yes (for earnings cards) | `x_823178_commissio_commission_calculations` | Rows for AE in demo year with `commission_amount`, `status`, `calculation_date`, `deal`, `sales_rep` |

Notes:
- Quota attainment is computed from **won deals vs plan targets**.
- Earnings/pending/paid cards are computed from **commission calculations**.
- If no active plan exists for selected year, page shows “No commission plan is assigned.”

### 9.2 M4/M5 Role + Navigation Smoke (Demo Gate)
Run this once before demo day:

1. Confirm module links exist and open:
	- `Dashboard` → `x_823178_commissio_dashboard.do`
	- `My Progress` → `x_823178_commissio_progress.do`
2. Validate role behavior:
	- Rep: sees own data only.
	- Manager: can select team rollup and managed reps.
	- Finance/Admin: broader selection works.
3. On progress page, validate for each AE:
	- Plan card renders.
	- Quota progress section is populated.
	- Earned/pending/paid metrics are populated.
	- Active deals table and pipeline value render.
4. Capture evidence (screenshots + user role used + AE name).

### 9.3 Go / No-Go for Live Demo
- **Go** when at least 2 AEs pass all checks in 9.2 with expected numbers.
- **No-Go** if any AE shows missing plan, empty quota progress with existing targets/deals, or role-scope leakage.
- If No-Go, fix data linkage first (`sales_rep`, plan linkages, year dates), then retest same AE.
