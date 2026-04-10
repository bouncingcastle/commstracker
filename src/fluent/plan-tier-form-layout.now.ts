import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: 'plan_tiers_default_section',
    table: 'sys_ui_section',
    data: {
        header: false,
        name: 'x_823178_commissio_plan_tiers',
        sys_domain: 'global',
        sys_domain_path: '/',
        title: true,
        view: 'Default view'
    }
})

Record({
    $id: 'plan_tiers_field_tier_name',
    table: 'sys_ui_element',
    data: {
        element: 'tier_name',
        position: 0,
        sys_ui_section: 'plan_tiers_default_section'
    }
})

Record({
    $id: 'plan_tiers_field_plan_target',
    table: 'sys_ui_element',
    data: {
        element: 'plan_target',
        position: 1,
        sys_ui_section: 'plan_tiers_default_section'
    }
})

Record({
    $id: 'plan_tiers_field_floor',
    table: 'sys_ui_element',
    data: {
        element: 'attainment_floor_percent',
        position: 2,
        sys_ui_section: 'plan_tiers_default_section'
    }
})

Record({
    $id: 'plan_tiers_field_ceiling',
    table: 'sys_ui_element',
    data: {
        element: 'attainment_ceiling_percent',
        position: 3,
        sys_ui_section: 'plan_tiers_default_section'
    }
})

Record({
    $id: 'plan_tiers_field_rate',
    table: 'sys_ui_element',
    data: {
        element: 'commission_rate_percent',
        position: 4,
        sys_ui_section: 'plan_tiers_default_section'
    }
})

Record({
    $id: 'plan_tiers_field_sort_order',
    table: 'sys_ui_element',
    data: {
        element: 'sort_order',
        position: 5,
        sys_ui_section: 'plan_tiers_default_section'
    }
})

Record({
    $id: 'plan_tiers_field_active',
    table: 'sys_ui_element',
    data: {
        element: 'is_active',
        position: 6,
        sys_ui_section: 'plan_tiers_default_section'
    }
})

Record({
    $id: 'plan_tiers_field_description',
    table: 'sys_ui_element',
    data: {
        element: 'description',
        position: 7,
        sys_ui_section: 'plan_tiers_default_section'
    }
})
