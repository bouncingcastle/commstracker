import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_823178_commissio_commission_calculations',
    view: default_view,
    columns: [
        'calculation_date',
        'commission_amount',
        'commission_base_amount',
        'commission_plan',
        'commission_rate',
        'deal',
        'deal_type',
        'invoice',
        'is_negative',
        'notes',
    ],
})
