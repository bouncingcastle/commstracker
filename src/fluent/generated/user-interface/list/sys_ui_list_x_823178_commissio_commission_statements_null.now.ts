import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_823178_commissio_commission_statements',
    view: default_view,
    columns: [
        'generated_date',
        'is_auto_generated',
        'locked_by',
        'locked_date',
        'notes',
        'paid_by',
        'paid_date',
        'payment_reference',
        'period_end_date',
        'period_start_date',
    ],
})
