import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: 'seed_bonus_scenarios_job',
    table: 'sysauto_script',
    data: {
        name: 'Commission Bonus Scenario Seed',
        script: Now.include('../../server/scheduled-scripts/seed-bonus-scenarios.js'),
        active: false,
        run_type: 'on_demand',
        run_time: '00:00:00',
        description: 'Idempotent click-test seeding for structured plan bonus scenarios (one-time quota, threshold edge cases).'
    }
})
