import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

const SECTION_DEFAULT_VIEW = 'a8c31b2f9f464f6c8f2a10b4d3e98711'
const SECTION_DEFAULT_LOWER = 'b91d4c3a7e5f4d1ca2b398760d4e2f23'
const SECTION_BASE = 'c24e5d6f8a9b4c1dbe20394756f1a834'

Record({
    $id: SECTION_DEFAULT_VIEW,
    table: 'sys_ui_section',
    data: {
        header: false,
        name: 'x_823178_commissio_plan_targets',
        sys_domain: 'global',
        sys_domain_path: '/',
        title: true,
        view: '',
    },
})

Record({
    $id: SECTION_DEFAULT_LOWER,
    table: 'sys_ui_section',
    data: {
        header: false,
        name: 'x_823178_commissio_plan_targets',
        sys_domain: 'global',
        sys_domain_path: '/',
        title: true,
        view: 'default',
    },
})

Record({
    $id: SECTION_BASE,
    table: 'sys_ui_section',
    data: {
        header: false,
        name: 'x_823178_commissio_plan_targets',
        sys_domain: 'global',
        sys_domain_path: '/',
        title: true,
        view: '',
    },
})

Record({
    $id: 'd1000000000000000000000000000001',
    table: 'sys_ui_element',
    data: {
        element: 'commission_plan',
        position: 0,
        sys_ui_section: SECTION_DEFAULT_VIEW,
    },
})

Record({
    $id: 'd1000000000000000000000000000002',
    table: 'sys_ui_element',
    data: {
        element: 'deal_type_ref',
        position: 1,
        sys_ui_section: SECTION_DEFAULT_VIEW,
    },
})

Record({
    $id: 'd1000000000000000000000000000003',
    table: 'sys_ui_element',
    data: {
        element: 'commission_rate_percent',
        position: 2,
        sys_ui_section: SECTION_DEFAULT_VIEW,
    },
})

Record({
    $id: 'd1000000000000000000000000000004',
    table: 'sys_ui_element',
    data: {
        element: 'annual_target_amount',
        position: 3,
        sys_ui_section: SECTION_DEFAULT_VIEW,
    },
})

Record({
    $id: 'd1000000000000000000000000000005',
    table: 'sys_ui_element',
    data: {
        element: 'is_active',
        position: 4,
        sys_ui_section: SECTION_DEFAULT_VIEW,
    },
})

Record({
    $id: 'd1000000000000000000000000000006',
    table: 'sys_ui_element',
    data: {
        element: 'description',
        position: 5,
        sys_ui_section: SECTION_DEFAULT_VIEW,
    },
})

Record({
    $id: 'd2000000000000000000000000000001',
    table: 'sys_ui_element',
    data: {
        element: 'commission_plan',
        position: 0,
        sys_ui_section: SECTION_DEFAULT_LOWER,
    },
})

Record({
    $id: 'd2000000000000000000000000000002',
    table: 'sys_ui_element',
    data: {
        element: 'deal_type_ref',
        position: 1,
        sys_ui_section: SECTION_DEFAULT_LOWER,
    },
})

Record({
    $id: 'd2000000000000000000000000000003',
    table: 'sys_ui_element',
    data: {
        element: 'commission_rate_percent',
        position: 2,
        sys_ui_section: SECTION_DEFAULT_LOWER,
    },
})

Record({
    $id: 'd2000000000000000000000000000004',
    table: 'sys_ui_element',
    data: {
        element: 'annual_target_amount',
        position: 3,
        sys_ui_section: SECTION_DEFAULT_LOWER,
    },
})

Record({
    $id: 'd2000000000000000000000000000005',
    table: 'sys_ui_element',
    data: {
        element: 'is_active',
        position: 4,
        sys_ui_section: SECTION_DEFAULT_LOWER,
    },
})

Record({
    $id: 'd2000000000000000000000000000006',
    table: 'sys_ui_element',
    data: {
        element: 'description',
        position: 5,
        sys_ui_section: SECTION_DEFAULT_LOWER,
    },
})

Record({
    $id: 'd3000000000000000000000000000001',
    table: 'sys_ui_element',
    data: {
        element: 'commission_plan',
        position: 0,
        sys_ui_section: SECTION_BASE,
    },
})

Record({
    $id: 'd3000000000000000000000000000002',
    table: 'sys_ui_element',
    data: {
        element: 'deal_type_ref',
        position: 1,
        sys_ui_section: SECTION_BASE,
    },
})

Record({
    $id: 'd3000000000000000000000000000003',
    table: 'sys_ui_element',
    data: {
        element: 'commission_rate_percent',
        position: 2,
        sys_ui_section: SECTION_BASE,
    },
})

Record({
    $id: 'd3000000000000000000000000000004',
    table: 'sys_ui_element',
    data: {
        element: 'annual_target_amount',
        position: 3,
        sys_ui_section: SECTION_BASE,
    },
})

Record({
    $id: 'd3000000000000000000000000000005',
    table: 'sys_ui_element',
    data: {
        element: 'is_active',
        position: 4,
        sys_ui_section: SECTION_BASE,
    },
})

Record({
    $id: 'd3000000000000000000000000000006',
    table: 'sys_ui_element',
    data: {
        element: 'description',
        position: 5,
        sys_ui_section: SECTION_BASE,
    },
})
