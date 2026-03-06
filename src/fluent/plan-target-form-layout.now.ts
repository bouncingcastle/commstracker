import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: 'plan_targets_default_section',
    table: 'sys_ui_section',
    data: {
        header: false,
        name: 'x_823178_commissio_plan_targets',
        sys_domain: 'global',
        sys_domain_path: '/',
        title: true,
        view: 'Default view'
    }
})

Record({
    $id: 'plan_targets_default_lower_section',
    table: 'sys_ui_section',
    data: {
        header: false,
        name: 'x_823178_commissio_plan_targets',
        sys_domain: 'global',
        sys_domain_path: '/',
        title: true,
        view: 'default'
    }
})

Record({
    $id: 'plan_targets_base_section',
    table: 'sys_ui_section',
    data: {
        header: false,
        name: 'x_823178_commissio_plan_targets',
        sys_domain: 'global',
        sys_domain_path: '/',
        title: true,
        view: ''
    }
})

Record({
    $id: 'plan_targets_field_commission_plan',
    table: 'sys_ui_element',
    data: {
        element: 'commission_plan',
        position: 0,
        sys_ui_section: 'plan_targets_default_section'
    }
})

Record({
    $id: 'plan_targets_field_deal_type_ref',
    table: 'sys_ui_element',
    data: {
        element: 'deal_type_ref',
        position: 1,
        sys_ui_section: 'plan_targets_default_section'
    }
})

Record({
    $id: 'plan_targets_field_commission_rate_percent',
    table: 'sys_ui_element',
    data: {
        element: 'commission_rate_percent',
        position: 2,
        sys_ui_section: 'plan_targets_default_section'
    }
})

Record({
    $id: 'plan_targets_field_annual_target_amount',
    table: 'sys_ui_element',
    data: {
        element: 'annual_target_amount',
        position: 3,
        sys_ui_section: 'plan_targets_default_section'
    }
})

Record({
    $id: 'plan_targets_field_is_active',
    table: 'sys_ui_element',
    data: {
        element: 'is_active',
        position: 4,
        sys_ui_section: 'plan_targets_default_section'
    }
})

Record({
    $id: 'plan_targets_field_description',
    table: 'sys_ui_element',
    data: {
        element: 'description',
        position: 5,
        sys_ui_section: 'plan_targets_default_section'
    }
})

Record({
    $id: 'plan_targets_default_lower_field_commission_plan',
    table: 'sys_ui_element',
    data: {
        element: 'commission_plan',
        position: 0,
        sys_ui_section: 'plan_targets_default_lower_section'
    }
})

Record({
    $id: 'plan_targets_default_lower_field_deal_type_ref',
    table: 'sys_ui_element',
    data: {
        element: 'deal_type_ref',
        position: 1,
        sys_ui_section: 'plan_targets_default_lower_section'
    }
})

Record({
    $id: 'plan_targets_default_lower_field_commission_rate_percent',
    table: 'sys_ui_element',
    data: {
        element: 'commission_rate_percent',
        position: 2,
        sys_ui_section: 'plan_targets_default_lower_section'
    }
})

Record({
    $id: 'plan_targets_default_lower_field_annual_target_amount',
    table: 'sys_ui_element',
    data: {
        element: 'annual_target_amount',
        position: 3,
        sys_ui_section: 'plan_targets_default_lower_section'
    }
})

Record({
    $id: 'plan_targets_default_lower_field_is_active',
    table: 'sys_ui_element',
    data: {
        element: 'is_active',
        position: 4,
        sys_ui_section: 'plan_targets_default_lower_section'
    }
})

Record({
    $id: 'plan_targets_default_lower_field_description',
    table: 'sys_ui_element',
    data: {
        element: 'description',
        position: 5,
        sys_ui_section: 'plan_targets_default_lower_section'
    }
})

Record({
    $id: 'plan_targets_base_field_commission_plan',
    table: 'sys_ui_element',
    data: {
        element: 'commission_plan',
        position: 0,
        sys_ui_section: 'plan_targets_base_section'
    }
})

Record({
    $id: 'plan_targets_base_field_deal_type_ref',
    table: 'sys_ui_element',
    data: {
        element: 'deal_type_ref',
        position: 1,
        sys_ui_section: 'plan_targets_base_section'
    }
})

Record({
    $id: 'plan_targets_base_field_commission_rate_percent',
    table: 'sys_ui_element',
    data: {
        element: 'commission_rate_percent',
        position: 2,
        sys_ui_section: 'plan_targets_base_section'
    }
})

Record({
    $id: 'plan_targets_base_field_annual_target_amount',
    table: 'sys_ui_element',
    data: {
        element: 'annual_target_amount',
        position: 3,
        sys_ui_section: 'plan_targets_base_section'
    }
})

Record({
    $id: 'plan_targets_base_field_is_active',
    table: 'sys_ui_element',
    data: {
        element: 'is_active',
        position: 4,
        sys_ui_section: 'plan_targets_base_section'
    }
})

Record({
    $id: 'plan_targets_base_field_description',
    table: 'sys_ui_element',
    data: {
        element: 'description',
        position: 5,
        sys_ui_section: 'plan_targets_base_section'
    }
})
