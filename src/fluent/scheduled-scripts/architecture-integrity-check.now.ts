import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: 'architecture_integrity_check_job',
    table: 'sysauto_script',
    data: {
        name: 'Commission Architecture Integrity Check',
        script: Now.include('../../server/scheduled-scripts/architecture-integrity-check.js'),
        active: false,
        run_type: 'daily',
        run_time: '00:45:00',
        description: 'Validates required architecture components (tables, roles, properties, modules, jobs) and logs a consolidated readiness record.'
    }
})
