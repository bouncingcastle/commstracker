import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_823178_commissio_commission_plans',
    view: default_view,
    columns: [
        'description',
        'effective_end_date',
        'effective_start_date',
        'is_active',
        'plan_name',
        'plan_overlap_approved_by',
        'sales_rep',
    ],
})
