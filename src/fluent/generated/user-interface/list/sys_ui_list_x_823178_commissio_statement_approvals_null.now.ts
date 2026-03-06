import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_823178_commissio_statement_approvals',
    view: default_view,
    columns: [
        'current_step',
        'decision_notes',
        'reviewed_by',
        'reviewed_on',
        'sales_rep',
        'statement',
        'status',
        'submitted_by',
        'submitted_on',
        'workflow_history',
    ],
})
