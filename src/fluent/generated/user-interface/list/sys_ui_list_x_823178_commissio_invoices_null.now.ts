import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_823178_commissio_invoices',
    view: default_view,
    columns: [
        'bigin_deal_id',
        'books_invoice_id',
        'customer_name',
        'deal',
        'invoice_date',
        'invoice_number',
        'is_mapped',
        'last_sync',
        'mapping_error',
        'status',
    ],
})
