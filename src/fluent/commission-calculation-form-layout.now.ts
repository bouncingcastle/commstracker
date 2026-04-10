import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: 'commission_calculations_default_section',
    table: 'sys_ui_section',
    data: {
        header: false,
        name: 'x_823178_commissio_commission_calculations',
        sys_domain: 'global',
        sys_domain_path: '/',
        title: true,
        view: 'Default view'
    }
})

Record({
    $id: 'commission_calculations_field_status',
    table: 'sys_ui_element',
    data: {
        element: 'status',
        position: 0,
        sys_ui_section: 'commission_calculations_default_section'
    }
})

Record({
    $id: 'commission_calculations_field_calculation_date',
    table: 'sys_ui_element',
    data: {
        element: 'calculation_date',
        position: 1,
        sys_ui_section: 'commission_calculations_default_section'
    }
})

Record({
    $id: 'commission_calculations_field_sales_rep',
    table: 'sys_ui_element',
    data: {
        element: 'sales_rep',
        position: 2,
        sys_ui_section: 'commission_calculations_default_section'
    }
})

Record({
    $id: 'commission_calculations_field_payment',
    table: 'sys_ui_element',
    data: {
        element: 'payment',
        position: 3,
        sys_ui_section: 'commission_calculations_default_section'
    }
})

Record({
    $id: 'commission_calculations_field_deal',
    table: 'sys_ui_element',
    data: {
        element: 'deal',
        position: 4,
        sys_ui_section: 'commission_calculations_default_section'
    }
})

Record({
    $id: 'commission_calculations_field_invoice',
    table: 'sys_ui_element',
    data: {
        element: 'invoice',
        position: 5,
        sys_ui_section: 'commission_calculations_default_section'
    }
})

Record({
    $id: 'commission_calculations_field_commission_plan',
    table: 'sys_ui_element',
    data: {
        element: 'commission_plan',
        position: 6,
        sys_ui_section: 'commission_calculations_default_section'
    }
})

Record({
    $id: 'commission_calculations_field_deal_type_ref',
    table: 'sys_ui_element',
    data: {
        element: 'deal_type_ref',
        position: 7,
        sys_ui_section: 'commission_calculations_default_section'
    }
})

Record({
    $id: 'commission_calculations_field_payment_date',
    table: 'sys_ui_element',
    data: {
        element: 'payment_date',
        position: 8,
        sys_ui_section: 'commission_calculations_default_section'
    }
})

Record({
    $id: 'commission_calculations_field_commission_base_amount',
    table: 'sys_ui_element',
    data: {
        element: 'commission_base_amount',
        position: 9,
        sys_ui_section: 'commission_calculations_default_section'
    }
})

Record({
    $id: 'commission_calculations_field_commission_rate',
    table: 'sys_ui_element',
    data: {
        element: 'commission_rate',
        position: 10,
        sys_ui_section: 'commission_calculations_default_section'
    }
})

Record({
    $id: 'commission_calculations_field_commission_amount',
    table: 'sys_ui_element',
    data: {
        element: 'commission_amount',
        position: 11,
        sys_ui_section: 'commission_calculations_default_section'
    }
})

Record({
    $id: 'commission_calculations_field_is_negative',
    table: 'sys_ui_element',
    data: {
        element: 'is_negative',
        position: 12,
        sys_ui_section: 'commission_calculations_default_section'
    }
})

Record({
    $id: 'commission_calculations_field_statement',
    table: 'sys_ui_element',
    data: {
        element: 'statement',
        position: 13,
        sys_ui_section: 'commission_calculations_default_section'
    }
})

Record({
    $id: 'commission_calculations_field_notes',
    table: 'sys_ui_element',
    data: {
        element: 'notes',
        position: 14,
        sys_ui_section: 'commission_calculations_default_section'
    }
})

Record({
    $id: 'commission_calculations_field_dispute_reason',
    table: 'sys_ui_element',
    data: {
        element: 'dispute_reason',
        position: 15,
        sys_ui_section: 'commission_calculations_default_section'
    }
})
