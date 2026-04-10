import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: 'backfill_deal_type_references_job',
    table: 'sysauto_script',
    data: {
        name: 'Commission Referential Integrity Audit',
        script: Now.include('../../server/scheduled-scripts/backfill-deal-type-references.js'),
        active: false,
        run_type: 'on_demand',
        run_time: '00:00:00',
        description: 'Strict-cutover maintenance utility. Audits deal-type references and tier target linkage integrity without using legacy code fields.'
    }
})
