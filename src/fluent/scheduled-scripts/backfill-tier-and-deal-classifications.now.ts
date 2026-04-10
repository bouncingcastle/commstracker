import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: 'backfill_tier_and_deal_classifications_job',
    table: 'sysauto_script',
    data: {
        name: 'Commission Referential Tier and Classification Maintenance',
        script: Now.include('../../server/scheduled-scripts/backfill-tier-and-deal-classifications.js'),
        active: false,
        run_type: 'on_demand',
        run_time: '00:00:00',
        description: 'Strict-cutover maintenance utility. Ensures deal primary classifications align to deal_type_ref and backfills missing tier ceilings by plan_target.'
    }
})
