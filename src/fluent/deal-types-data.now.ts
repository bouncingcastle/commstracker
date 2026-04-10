import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: 'deal_type_new_business',
    table: 'x_823178_commissio_deal_types',
    data: {
        code: 'new_business',
        name: 'New Business',
        description: 'Net-new logo or first-time sale to an account.',
        sort_order: 10,
        is_active: true,
        is_system: true
    }
})

Record({
    $id: 'deal_type_renewal',
    table: 'x_823178_commissio_deal_types',
    data: {
        code: 'renewal',
        name: 'Renewal',
        description: 'Contract continuation for an existing subscription/term.',
        sort_order: 20,
        is_active: true,
        is_system: true
    }
})

Record({
    $id: 'deal_type_expansion',
    table: 'x_823178_commissio_deal_types',
    data: {
        code: 'expansion',
        name: 'Expansion',
        description: 'Increased spend or scope within an existing customer.',
        sort_order: 30,
        is_active: true,
        is_system: true
    }
})

Record({
    $id: 'deal_type_upsell',
    table: 'x_823178_commissio_deal_types',
    data: {
        code: 'upsell',
        name: 'Upsell',
        description: 'Upgrade to higher edition/tier within existing line.',
        sort_order: 40,
        is_active: true,
        is_system: true
    }
})

Record({
    $id: 'deal_type_other',
    table: 'x_823178_commissio_deal_types',
    data: {
        code: 'other',
        name: 'Other',
        description: 'Fallback business deal type outside standard taxonomy.',
        sort_order: 90,
        is_active: true,
        is_system: true
    }
})
