import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Keep plan setup on a single form workflow:
// Commission Plan -> Targets / Tiers / Bonuses related lists
Record({
    $id: 'commission_plan_targets_related_list',
    table: 'sys_ui_related_list',
    data: {
        name: 'x_823178_commissio_commission_plans',
        related_list: 'x_823178_commissio_plan_targets.commission_plan'
    }
})

Record({
    $id: 'commission_plan_tiers_related_list',
    table: 'sys_ui_related_list',
    data: {
        name: 'x_823178_commissio_commission_plans',
        related_list: 'x_823178_commissio_plan_tiers.commission_plan'
    }
})

Record({
    $id: 'commission_plan_bonuses_related_list',
    table: 'sys_ui_related_list',
    data: {
        name: 'x_823178_commissio_commission_plans',
        related_list: 'x_823178_commissio_plan_bonuses.commission_plan'
    }
})

Record({
    $id: 'commission_plan_recognition_policies_related_list',
    table: 'sys_ui_related_list',
    data: {
        name: 'x_823178_commissio_commission_plans',
        related_list: 'x_823178_commissio_plan_recognition_policies.commission_plan'
    }
})
