import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_823178_commissio_commission_calculations',
    view: default_view,
    columns: [
        'accelerator_applied',
        'accelerator_delta_component',
        'approval_date',
        'approved',
        'approved_by',
        'attained_amount_snapshot',
        'attainment_percent_at_calc',
        'base_commission_component',
        'bonus_amount',
        'bonus_component',
    ],
})
