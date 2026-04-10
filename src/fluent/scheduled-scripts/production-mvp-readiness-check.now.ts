import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: 'production_mvp_readiness_check_job',
    table: 'sysauto_script',
    data: {
        name: 'Commission Production MVP Readiness Check',
        script: Now.include('../../server/scheduled-scripts/production-mvp-readiness-check.js'),
        active: false,
        run_type: 'daily',
        run_time: '01:00:00',
        description: 'Generates production readiness evidence (module presence, seed mode posture, role prerequisites) into reconciliation logs/alerts.'
    }
})
