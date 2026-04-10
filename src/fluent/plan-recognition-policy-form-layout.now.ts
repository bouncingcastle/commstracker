import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: 'plan_recognition_policies_default_section',
    table: 'sys_ui_section',
    data: {
        header: false,
        name: 'x_823178_commissio_plan_recognition_policies',
        sys_domain: 'global',
        sys_domain_path: '/',
        title: true,
        view: 'Default view'
    }
})

Record({
    $id: 'plan_recognition_policies_field_commission_plan',
    table: 'sys_ui_element',
    data: {
        element: 'commission_plan',
        position: 0,
        sys_ui_section: 'plan_recognition_policies_default_section'
    }
})

Record({
    $id: 'plan_recognition_policies_field_version_number',
    table: 'sys_ui_element',
    data: {
        element: 'version_number',
        position: 1,
        sys_ui_section: 'plan_recognition_policies_default_section'
    }
})

Record({
    $id: 'plan_recognition_policies_field_policy_state',
    table: 'sys_ui_element',
    data: {
        element: 'policy_state',
        position: 2,
        sys_ui_section: 'plan_recognition_policies_default_section'
    }
})

Record({
    $id: 'plan_recognition_policies_field_recognition_basis',
    table: 'sys_ui_element',
    data: {
        element: 'recognition_basis',
        position: 3,
        sys_ui_section: 'plan_recognition_policies_default_section'
    }
})

Record({
    $id: 'plan_recognition_policies_field_effective_start_date',
    table: 'sys_ui_element',
    data: {
        element: 'effective_start_date',
        position: 4,
        sys_ui_section: 'plan_recognition_policies_default_section'
    }
})

Record({
    $id: 'plan_recognition_policies_field_effective_end_date',
    table: 'sys_ui_element',
    data: {
        element: 'effective_end_date',
        position: 5,
        sys_ui_section: 'plan_recognition_policies_default_section'
    }
})

Record({
    $id: 'plan_recognition_policies_field_is_active',
    table: 'sys_ui_element',
    data: {
        element: 'is_active',
        position: 6,
        sys_ui_section: 'plan_recognition_policies_default_section'
    }
})

Record({
    $id: 'plan_recognition_policies_field_supersedes_policy',
    table: 'sys_ui_element',
    data: {
        element: 'supersedes_policy',
        position: 7,
        sys_ui_section: 'plan_recognition_policies_default_section'
    }
})

Record({
    $id: 'plan_recognition_policies_field_superseded_by_policy',
    table: 'sys_ui_element',
    data: {
        element: 'superseded_by_policy',
        position: 8,
        sys_ui_section: 'plan_recognition_policies_default_section'
    }
})

Record({
    $id: 'plan_recognition_policies_field_description',
    table: 'sys_ui_element',
    data: {
        element: 'description',
        position: 9,
        sys_ui_section: 'plan_recognition_policies_default_section'
    }
})
