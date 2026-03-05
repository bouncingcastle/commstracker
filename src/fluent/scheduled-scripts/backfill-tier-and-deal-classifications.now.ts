import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: 'backfill_tier_and_deal_classifications_job',
    table: 'sysauto_script',
    data: {
        name: 'Commission Backfill: Tier Bands and Deal Classifications',
        script: Now.include('../../server/scheduled-scripts/backfill-tier-and-deal-classifications.js'),
        active: false,
        run_type: 'on_demand',
        run_time: '00:00:00',
        description: 'One-time migration utility. Backfills explicit tier ceilings and many-to-many deal classification rows from legacy deal_type values.'
    }
})
