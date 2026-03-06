import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: 'commission_plans_default_section',
    table: 'sys_ui_section',
    data: {
        header: false,
        name: 'x_823178_commissio_commission_plans',
        sys_domain: 'global',
        sys_domain_path: '/',
        title: true,
        view: 'Default view'
    }
})

Record({
    $id: 'commission_plans_field_plan_name',
    table: 'sys_ui_element',
    data: {
        element: 'plan_name',
        position: 0,
        sys_ui_section: 'commission_plans_default_section'
    }
})

Record({
    $id: 'commission_plans_field_sales_rep',
    table: 'sys_ui_element',
    data: {
        element: 'sales_rep',
        position: 1,
        sys_ui_section: 'commission_plans_default_section'
    }
})

Record({
    $id: 'commission_plans_field_lifecycle_state',
    table: 'sys_ui_element',
    data: {
        element: 'lifecycle_state',
        position: 2,
        sys_ui_section: 'commission_plans_default_section'
    }
})

Record({
    $id: 'commission_plans_field_plan_version',
    table: 'sys_ui_element',
    data: {
        element: 'plan_version',
        position: 3,
        sys_ui_section: 'commission_plans_default_section'
    }
})

Record({
    $id: 'commission_plans_field_effective_start_date',
    table: 'sys_ui_element',
    data: {
        element: 'effective_start_date',
        position: 4,
        sys_ui_section: 'commission_plans_default_section'
    }
})

Record({
    $id: 'commission_plans_field_effective_end_date',
    table: 'sys_ui_element',
    data: {
        element: 'effective_end_date',
        position: 5,
        sys_ui_section: 'commission_plans_default_section'
    }
})

Record({
    $id: 'commission_plans_field_is_active',
    table: 'sys_ui_element',
    data: {
        element: 'is_active',
        position: 6,
        sys_ui_section: 'commission_plans_default_section'
    }
})

Record({
    $id: 'commission_plans_field_base_rate',
    table: 'sys_ui_element',
    data: {
        element: 'base_rate',
        position: 7,
        sys_ui_section: 'commission_plans_default_section'
    }
})

Record({
    $id: 'commission_plans_field_upsell_rate',
    table: 'sys_ui_element',
    data: {
        element: 'upsell_rate',
        position: 8,
        sys_ui_section: 'commission_plans_default_section'
    }
})

Record({
    $id: 'commission_plans_field_supersedes_plan',
    table: 'sys_ui_element',
    data: {
        element: 'supersedes_plan',
        position: 9,
        sys_ui_section: 'commission_plans_default_section'
    }
})

Record({
    $id: 'commission_plans_field_superseded_by_plan',
    table: 'sys_ui_element',
    data: {
        element: 'superseded_by_plan',
        position: 10,
        sys_ui_section: 'commission_plans_default_section'
    }
})

Record({
    $id: 'commission_plans_field_plan_overlap_approved_by',
    table: 'sys_ui_element',
    data: {
        element: 'plan_overlap_approved_by',
        position: 11,
        sys_ui_section: 'commission_plans_default_section'
    }
})

Record({
    $id: 'commission_plans_field_plan_overlap_approved_on',
    table: 'sys_ui_element',
    data: {
        element: 'plan_overlap_approved_on',
        position: 12,
        sys_ui_section: 'commission_plans_default_section'
    }
})

Record({
    $id: 'commission_plans_field_plan_overlap_reason',
    table: 'sys_ui_element',
    data: {
        element: 'plan_overlap_reason',
        position: 13,
        sys_ui_section: 'commission_plans_default_section'
    }
})

Record({
    $id: 'commission_plans_field_description',
    table: 'sys_ui_element',
    data: {
        element: 'description',
        position: 14,
        sys_ui_section: 'commission_plans_default_section'
    }
})
