import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Keep plan setup on a single form workflow:
// Commission Plan -> Targets / Tiers / Bonuses related lists
Record({
    $id: 'commission_plan_targets_related_list',
    table: 'sys_ui_related_list',
    data: {
        name: 'x_823178_commissio_commission_plans',
        related_list: 'x_823178_commissio_plan_targets.commission_plan',
        view_name: 'default'
    }
})

Record({
    $id: 'commission_plan_tiers_related_list',
    table: 'sys_ui_related_list',
    data: {
        name: 'x_823178_commissio_commission_plans',
        related_list: 'x_823178_commissio_plan_tiers.commission_plan',
        view_name: 'default'
    }
})

Record({
    $id: 'commission_plan_bonuses_related_list',
    table: 'sys_ui_related_list',
    data: {
        name: 'x_823178_commissio_commission_plans',
        related_list: 'x_823178_commissio_plan_bonuses.commission_plan',
        view_name: 'default'
    }
})

Record({
    $id: 'commission_plan_recognition_policies_related_list',
    table: 'sys_ui_related_list',
    data: {
        name: 'x_823178_commissio_commission_plans',
        related_list: 'x_823178_commissio_plan_recognition_policies.commission_plan',
        view_name: 'default'
    }
})

Record({
    $id: 'commission_calculation_bonus_earnings_related_list',
    table: 'sys_ui_related_list',
    data: {
        name: 'x_823178_commissio_commission_calculations',
        related_list: 'x_823178_commissio_bonus_earnings.commission_calculation',
        view_name: 'default'
    }
})

Record({
    $id: 'plan_bonus_bonus_earnings_related_list',
    table: 'sys_ui_related_list',
    data: {
        name: 'x_823178_commissio_plan_bonuses',
        related_list: 'x_823178_commissio_bonus_earnings.plan_bonus',
        view_name: 'default'
    }
})

Record({
    $id: 'plan_target_tiers_related_list',
    table: 'sys_ui_related_list',
    data: {
        name: 'x_823178_commissio_plan_targets',
        related_list: 'x_823178_commissio_plan_tiers.plan_target',
        view_name: 'default'
    }
})

Record({
    $id: 'commission_plan_targets_related_list_default_view_label',
    table: 'sys_ui_related_list',
    data: {
        name: 'x_823178_commissio_commission_plans',
        related_list: 'x_823178_commissio_plan_targets.commission_plan',
        view_name: 'Default view'
    }
})

Record({
    $id: 'commission_plan_tiers_related_list_default_view_label',
    table: 'sys_ui_related_list',
    data: {
        name: 'x_823178_commissio_commission_plans',
        related_list: 'x_823178_commissio_plan_tiers.commission_plan',
        view_name: 'Default view'
    }
})

Record({
    $id: 'commission_plan_bonuses_related_list_default_view_label',
    table: 'sys_ui_related_list',
    data: {
        name: 'x_823178_commissio_commission_plans',
        related_list: 'x_823178_commissio_plan_bonuses.commission_plan',
        view_name: 'Default view'
    }
})

Record({
    $id: 'commission_plan_recognition_policies_related_list_default_view_label',
    table: 'sys_ui_related_list',
    data: {
        name: 'x_823178_commissio_commission_plans',
        related_list: 'x_823178_commissio_plan_recognition_policies.commission_plan',
        view_name: 'Default view'
    }
})

Record({
    $id: 'plan_target_tiers_related_list_default_view_label',
    table: 'sys_ui_related_list',
    data: {
        name: 'x_823178_commissio_plan_targets',
        related_list: 'x_823178_commissio_plan_tiers.plan_target',
        view_name: 'Default view'
    }
})
