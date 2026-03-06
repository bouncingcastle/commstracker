import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_823178_commissio_deals',
    view: default_view,
    columns: [
        'account_name',
        'amount',
        'bigin_deal_id',
        'close_date',
        'commission_calculations_count',
        'current_owner',
        'deal_name',
        'deal_type',
        'finance_approval_date',
        'finance_approved',
    ],
})
