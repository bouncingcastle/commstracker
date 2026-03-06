import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_823178_commissio_system_alerts',
    view: default_view,
    columns: [
        'acknowledged_by',
        'acknowledged_date',
        'alert_date',
        'message',
        'resolution_notes',
        'resolved_by',
        'resolved_date',
        'severity',
        'status',
        'title',
    ],
})
