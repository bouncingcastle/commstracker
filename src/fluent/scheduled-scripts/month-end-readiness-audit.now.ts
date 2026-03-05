import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: 'month_end_readiness_audit_job',
    table: 'sysauto_script',
    data: {
        name: 'Commission Month-End Readiness Audit',
        script: Now.include('../../server/scheduled-scripts/month-end-readiness-audit.js'),
        active: false,
        run_type: 'daily',
        run_time: '01:30:00',
        description: 'Audits month-end readiness metrics and integrity risks (statements, approvals, orphaned calculations) into reconciliation logs/alerts.'
    }
})
