import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Monthly commission statement generation - using Record API
Record({
    $id: Now.ID['monthly_statement_job'],
    table: 'sysauto_script',
    data: {
        name: 'Generate Monthly Commission Statements',
        script: Now.include('../../server/scheduled-scripts/monthly-statements.js'),
        active: true,
        run_type: 'monthly',
        run_dayofmonth: 1,
        run_time: '2026-03-06 03:47:29',
        description: 'Automatically generates commission statements for all reps on the 1st of each month',
        advanced: 'false',
        conditional: 'false',
        upgrade_safe: 'false',
    },
})
