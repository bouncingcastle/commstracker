import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// One-time payout eligibility backfill (disabled by default)
Record({
    $id: Now.ID['payout_eligibility_backfill_job'],
    table: 'sysauto_script',
    data: {
        name: 'Backfill Commission Payout Eligibility Dates',
        script: Now.include('../../server/scheduled-scripts/backfill-payout-eligibility.js'),
        active: false,
        run_type: 'daily',
        run_time: '03:30:00',
        description: 'One-time backfill for payout_eligible_date and payout_schedule_snapshot on existing commission calculations. Enable and run once, then disable.'
    }
})
