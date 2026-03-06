import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_823178_commissio_commission_plans',
    view: default_view,
    columns: [
        'base_rate',
        'deal_type',
        'description',
        'effective_end_date',
        'effective_start_date',
        'expansion_rate',
        'is_active',
        'new_business_rate',
        'plan_name',
        'plan_overlap_approved_by',
    ],
})
