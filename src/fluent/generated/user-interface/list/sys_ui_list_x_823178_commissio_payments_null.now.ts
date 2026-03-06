import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_823178_commissio_payments',
    view: default_view,
    columns: [
        'books_payment_id',
        'books_reconciled',
        'calculation_lock',
        'calculation_lock_timestamp',
        'commission_calculated',
        'commission_calculation_id',
        'deal',
        'invoice',
        'last_sync',
        'payment_amount',
    ],
})
