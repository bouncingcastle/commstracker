# Commission Management System

ServiceNow scoped application (`x_823178_commissio`) for automated commission tracking, calculation, and statement management.

## Status

| Milestone | State |
|---|---|
| Core functionality | Complete |
| Data model and business rules | Complete |
| UI surfaces (dashboard, progress, plan explorer, statements) | Complete |
| Operational automation (reconciliation, readiness checks) | Complete |
| Production validation (SV-01..SV-06) | Pending execution |
| Production go-live | Blocked on validation evidence |

**Current posture:** Ready for controlled pilot / demo. Production go-live requires completing the exit checklist below.

---

## What's Built

### Data Model

| Table | Purpose |
|---|---|
| Deals | Anchors close-date, ownership snapshot, and deal classification |
| Invoices | Maps to deals; commission base = invoice subtotal (excludes tax) |
| Payments | Triggers commission calculations on cash received |
| Commission Plans | Rep-specific rate plans with effective date ranges |
| Plan Targets | Annual targets per deal type per plan |
| Plan Tiers | Contiguous attainment bands with marginal rates (base + accelerator) |
| Plan Bonuses | Structured qualification rules with one-time-per-period dedupe |
| Plan Recognition Policies | Temporal basis for payout eligibility (cash/invoice/booking/milestone) |
| Deal Classifications | Many-to-many deal-type mapping with governed primary selection |
| Commission Calculations | Individual payment-level entries with full explainability |
| Bonus Earnings | Earned bonus records linked to calculations |
| Commission Statements | Monthly rollups with Draft > Locked > Paid workflow |
| Statement Approvals | Approval lifecycle with actor/timestamp evidence |
| Forecast Scenarios | Rep scenario planning and estimator outputs |
| Exception Approvals | High-value and edge-case approval routing |
| System Alerts | Operational alerts from reconciliation and monitoring |
| Reconciliation Logs | Audit trail from automated operational checks |

### Business Rules

| Rule | Behavior |
|---|---|
| Deal snapshot | Captures owner, rate plan, and classification at close-won; immutable after snapshot |
| Payment commission | Calculates commission on payment insert; highest-applicable rate from multi-classification candidates; marginal tier math; refunds create negative entries |
| Duplicate prevention | Unique constraints on payment/calculation pairs; idempotency locks |
| Plan validation | Overlap prevention, contiguous tier enforcement, rate limits |
| Tier validation | Explicit floor/ceiling required; no gaps or overlaps per scope |
| Bonus validation | Structured metric evaluation; one-time-per-period guard |
| Statement approval | Enforced state transitions (draft > submitted > approved/rejected > locked > paid) |
| Deal classification | Single primary per deal; no duplicate type mappings |
| Deal type governance | Code renames blocked to protect referential integrity |

### Calculation Logic

```
Commission Base = Invoice Subtotal (excluding tax)
Payment Ratio  = Payment Amount / Invoice Total  (capped at 1.0)
Prorated Base  = Commission Base x Payment Ratio
Commission     = Sum of marginal tier slices across attainment bands
```

- Rate determined by rep's active plan at **deal close date** (not payment date)
- Highest-applicable classification rate selected when multiple mappings exist
- Marginal payout across tier bands (not top-rate-over-full-base)
- Cent-level precision with rounding safeguards
- Full explainability persisted: base/accelerator/bonus components, tier selection, rate candidates

### Scheduled Automation

| Job | Frequency | Purpose |
|---|---|---|
| Monthly Statement Generation | 1st of month | Aggregates calculations into draft statements |
| Daily Commission Reconciliation | Daily | Variance detection, orphan cleanup, recalculation validation |
| Architecture Integrity Check | On-demand | Validates required tables, roles, properties, modules, jobs |
| Production MVP Readiness Check | On-demand | Module/role/seed posture preflight |
| Month-End Readiness Audit | On-demand | Stale approvals, orphaned calcs, statement generation presence |
| Seed Governance Reconciliation | On-demand | Duplicate detection, menu/module baseline evidence |

### Security Model

| Role | Access |
|---|---|
| `x_823178_commissio.rep` | Own deals, calculations, statements, progress |
| `x_823178_commissio.manager` | Team rollups for managed reps |
| `x_823178_commissio.finance` | Statement lock/pay actions; global read |
| `x_823178_commissio.admin` | Full configuration and data access |

Roles are assigned manually in ServiceNow (`User Administration > Users > Roles`).

### UI Surfaces

| Page | URL | Purpose |
|---|---|---|
| Operations Dashboard | `x_823178_commissio_dashboard.do` | KPIs, quick actions, system health |
| My Progress | `x_823178_commissio_progress.do` | Rep earnings, quota attainment, pipeline, tier context |
| Plan Hierarchy | `x_823178_commissio_plan_hierarchy.do` | Plan/target/tier/bonus/policy explorer |
| Statement Explainability | `x_823178_commissio_statement_explainability.do` | Line-item component drill-down |

Admin users see a rep selector on the progress page. Managers see team rollup. Reps see own data only.

### Financial Controls

| Control | Threshold | Action |
|---|---|---|
| Commission limit per payment | $50,000 | Hard stop |
| Deal amount limit | $10,000,000 | Finance approval required |
| Payment amount limit | $5,000,000 | Hard stop |
| High commission flag | >$10,000 | Finance approval required |
| Reconciliation variance | >$100 | System alert |
| Calculation lock | 5 minutes | Prevents concurrent processing |

Thresholds are configurable via system properties.

### Integration

Data ingestion is external. The app exposes REST endpoints for Zoho sync but production data loading is expected via an external pipeline directly into app tables.

Minimum data contract:
- Deals: `bigin_deal_id` populated where available
- Invoices: `books_invoice_id` set; mapped to deals via `bigin_deal_id` or `deal` reference
- Payments: `books_payment_id` set; mapped to invoices/deals
- Commission plans and plan structures configured before payment ingestion begins

---

## Roadmap to Production

### Phase 0: Validation and Go-Live (current)

Complete the production exit checklist to move from pilot to production.

**Exit Checklist:**

| # | Gate | Status | What's Needed |
|---|---|---|---|
| E1 | Menu and navigation validation | Pending | Run seed governance reconcile + role-nav smoke for all 4 personas + two clean deploy passes |
| E2 | Role/access UAT sign-off | Pending | Access matrix (rep/manager/finance/admin) with pass/fail evidence and approver |
| E3 | Month-end dry run | Pending | Single cycle: ingest > calculate > generate statement > approve. Zero critical exceptions |
| E4 | Operational readiness pack | Pending | Published runbook + alert ownership roster + rollback procedure validated |
| E5 | Cutover and hypercare plan | Pending | Named owners, timelines, escalation path for first week |

**Validation suites** (in `validation/` folder):

| Suite | Scope | Method |
|---|---|---|
| SV-01 | Plan and tier governance | ATF + UI |
| SV-02 | Snapshot immutability | ATF + UI |
| SV-03 | Payment-driven calculation | ATF + UI |
| SV-04 | Rate selection and marginal explainability | ATF + UI |
| SV-05 | Role-based visibility | Manual impersonation |
| SV-06 | Exception/duplicate prevention and reconciliation | ATF + background probe |

Execution order: SV-01 > SV-02 > SV-03 > SV-04 > SV-05 > SV-06. If SV-01 or SV-02 fails, stop and fix before proceeding.

### Phase 1: Operational Hardening

| Item | Function IDs | Description |
|---|---|---|
| Zoho sync validation | F-18 | End-to-end integration testing with production credentials |
| Load testing | F-17 | 1000+ concurrent API calls |
| Monitoring setup | F-17 | Alert notification distribution lists and escalation |
| Disaster recovery | — | Backup/restore procedures documented and tested |

### Phase 2: Finance Operations

| Item | Function IDs | Description |
|---|---|---|
| Finance cockpit | F-19 | Queue-driven workspace for approvals, payout windows, exception SLAs |
| Advanced reporting | F-24 | Trend/cohort/variance saved views |

### Phase 3: Enterprise Scale

| Item | Function IDs | Description |
|---|---|---|
| Dispute management | F-20, F-21 | Case lifecycle with threaded commentary and SLA tracking |
| Compliance exports | F-22 | Immutable event journal and evidence export |
| Multi-currency | F-23 | FX rate snapshots at calculation time |

---

## Build and Deploy

```sh
npm run build
npm run transform
npm run types
npm run deploy
```

---

## Known Limitations

- **Forecasting confidence is moderate.** Stage-probability heuristics are static, not calibrated by actual receipt data. Forecasts are directional guidance, not finance-grade projections.
- **No finance cockpit.** Statement management uses standard ServiceNow list/form UX until Phase 2.
- **No dispute workflow.** Disputes are handled manually until Phase 3.
- **Single currency only.** Multi-currency support is Phase 3.
- **No native Zoho ingestion in production.** REST endpoints exist but production data loading is expected via external pipeline.
