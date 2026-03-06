import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_823178_commissio_reconciliation_log',
    view: default_view,
    columns: [
        'details',
        'errors_found',
        'processing_time_seconds',
        'reconciliation_date',
        'records_checked',
        'significant_variances',
        'status',
        'total_variances',
        'warnings_found',
    ],
})
