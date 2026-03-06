import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_823178_commissio_manager_team_memberships',
    view: default_view,
    columns: [
        'approved_by',
        'approved_on',
        'effective_end_date',
        'effective_start_date',
        'governance_source',
        'is_active',
        'manager_user',
        'notes',
        'sales_rep',
    ],
})
