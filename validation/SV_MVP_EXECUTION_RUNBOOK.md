# ServiceNow Minimal MVP Execution Runbook (SV-01..SV-06)

This runbook executes the minimal commission-tracking MVP assessment for ServiceNow UI + runtime functionality.

Scope covered:
- `SV-01` Plan and tier governance (`F-01`, `F-02`)
- `SV-02` Snapshot immutability (`F-04`)
- `SV-03` Payment-driven commission runtime (`F-05`)
- `SV-04` Deterministic rate selection and marginal explainability (`F-06`, `F-07`)
- `SV-05` Role-based access and visibility (`F-14`)
- `SV-06` Exceptions, duplicate prevention, reconciliation controls (`F-17`)

Out of scope for this run:
- Ingestion runtime (`F-18`) because Zoho insertion is externalized
- Post-MVP domains (`F-19` through `F-24`)

## 1) Preflight

1. Deploy latest app metadata to the target non-production instance.
2. Confirm these roles exist and are assigned to test users:
   - `x_823178_commissio.rep`
   - `x_823178_commissio.manager`
   - `x_823178_commissio.finance`
   - `x_823178_commissio.admin`
3. Confirm these pages load:
   - `x_823178_commissio_dashboard.do`
   - `x_823178_commissio_progress.do`
   - `x_823178_commissio_statement_explainability.do`
4. Confirm system properties are present (thresholds/timeouts/payout schedule).
5. Prepare test data owners and a dedicated test naming prefix, for example `SV_MVP_`.

## 2) Required Artifacts In This Repo

1. ATF blueprint: [SV_MVP_ATF_BLUEPRINT.md](/Users/chris/Git/comms-tracker/commstracker/validation/SV_MVP_ATF_BLUEPRINT.md)
2. UI/impersonation checklist: [SV_MVP_UI_IMPERSONATION_CHECKLIST.md](/Users/chris/Git/comms-tracker/commstracker/validation/SV_MVP_UI_IMPERSONATION_CHECKLIST.md)
3. Background probe script: [sv_mvp_background_probes.js](/Users/chris/Git/comms-tracker/commstracker/validation/sv_mvp_background_probes.js)

## 3) Execution Order

1. Run ATF tests for `SV-01`, `SV-02`, `SV-03`, `SV-04`, `SV-06`.
2. Run manual UI + impersonation checklist for `SV-05` and UI evidence for the other suites.
3. Run the background probe script in `Scripts - Background` with the evidence `sys_id` values from this run.
4. Consolidate results in one evidence table (suite, result, references, owner).

## 4) Evidence Contract

Capture this for each suite:

1. `Result`: Pass / Warning / Fail
2. `Record Evidence`: `sys_id` values for plan/target/tier/deal/payment/calculation/statement/alert/reconciliation rows
3. `UI Evidence`: screenshots for key pages and any blocked validation messages
4. `Notes`: defects or caveats with owner and ETA

Recommended evidence row format:

| Suite | Result | Evidence IDs | UI Evidence | Notes |
|---|---|---|---|---|
| SV-01 |  |  |  |  |
| SV-02 |  |  |  |  |
| SV-03 |  |  |  |  |
| SV-04 |  |  |  |  |
| SV-05 |  |  |  |  |
| SV-06 |  |  |  |  |

## 5) Go / No-Go For This Minimal Scope

Go when all conditions are true:

1. `SV-01` through `SV-06` are pass, or warning with explicit owner/ETA and no critical defects.
2. No role-scope leakage in `SV-05`.
3. No unresolved duplicate or orphaned calculation defects in `SV-06`.
4. Reconciliation result is not critical-failed without owner.

No-Go when any condition is true:

1. Any critical fail in payout correctness, snapshot immutability, or role access.
2. Any unresolved duplicate-payout behavior.
3. Any UI path required for rep/manager/finance/admin cannot be exercised.
