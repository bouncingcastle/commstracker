import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Daily reconciliation and integrity checks
Record({
    $id: Now.ID['daily_reconciliation_job'],
    table: 'sysauto_script',
    data: {
        name: 'Daily Commission Reconciliation',
        script: Now.include('../../server/scheduled-scripts/daily-reconciliation.js'),
        active: true,
        run_type: 'daily',
        run_time: '01:00:00',
        description: 'Runs daily reconciliation checks for commission integrity, duplicates, and orphan records.'
    }
})
