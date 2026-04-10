import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: 'plan_bonuses_default_section',
    table: 'sys_ui_section',
    data: {
        header: false,
        name: 'x_823178_commissio_plan_bonuses',
        sys_domain: 'global',
        sys_domain_path: '/',
        title: true,
        view: 'Default view'
    }
})

Record({
    $id: 'plan_bonuses_field_commission_plan',
    table: 'sys_ui_element',
    data: {
        element: 'commission_plan',
        position: 0,
        sys_ui_section: 'plan_bonuses_default_section'
    }
})

Record({
    $id: 'plan_bonuses_field_bonus_name',
    table: 'sys_ui_element',
    data: {
        element: 'bonus_name',
        position: 1,
        sys_ui_section: 'plan_bonuses_default_section'
    }
})

Record({
    $id: 'plan_bonuses_field_bonus_amount',
    table: 'sys_ui_element',
    data: {
        element: 'bonus_amount',
        position: 2,
        sys_ui_section: 'plan_bonuses_default_section'
    }
})

Record({
    $id: 'plan_bonuses_field_deal_type_ref',
    table: 'sys_ui_element',
    data: {
        element: 'deal_type_ref',
        position: 3,
        sys_ui_section: 'plan_bonuses_default_section'
    }
})

Record({
    $id: 'plan_bonuses_field_qualification_metric',
    table: 'sys_ui_element',
    data: {
        element: 'qualification_metric',
        position: 4,
        sys_ui_section: 'plan_bonuses_default_section'
    }
})

Record({
    $id: 'plan_bonuses_field_qualification_operator',
    table: 'sys_ui_element',
    data: {
        element: 'qualification_operator',
        position: 5,
        sys_ui_section: 'plan_bonuses_default_section'
    }
})

Record({
    $id: 'plan_bonuses_field_qualification_threshold',
    table: 'sys_ui_element',
    data: {
        element: 'qualification_threshold',
        position: 6,
        sys_ui_section: 'plan_bonuses_default_section'
    }
})

Record({
    $id: 'plan_bonuses_field_evaluation_period',
    table: 'sys_ui_element',
    data: {
        element: 'evaluation_period',
        position: 7,
        sys_ui_section: 'plan_bonuses_default_section'
    }
})

Record({
    $id: 'plan_bonuses_field_one_time_per_period',
    table: 'sys_ui_element',
    data: {
        element: 'one_time_per_period',
        position: 8,
        sys_ui_section: 'plan_bonuses_default_section'
    }
})

Record({
    $id: 'plan_bonuses_field_is_active',
    table: 'sys_ui_element',
    data: {
        element: 'is_active',
        position: 9,
        sys_ui_section: 'plan_bonuses_default_section'
    }
})

Record({
    $id: 'plan_bonuses_field_description',
    table: 'sys_ui_element',
    data: {
        element: 'description',
        position: 10,
        sys_ui_section: 'plan_bonuses_default_section'
    }
})
