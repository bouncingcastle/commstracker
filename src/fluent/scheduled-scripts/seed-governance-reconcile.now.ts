import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: 'seed_governance_reconcile_job',
    table: 'sysauto_script',
    data: {
        name: 'Commission Seed Governance Reconciliation',
        script: Now.include('../../server/scheduled-scripts/seed-governance-reconcile.js'),
        active: false,
        run_type: 'daily',
        run_time: '00:30:00',
        description: 'Controlled idempotency reconciliation for navigation/demo seed duplicates. Enable for cleanup windows, then disable.'
    }
})
