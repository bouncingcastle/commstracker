import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_823178_commissio_exception_approvals',
    view: default_view,
    columns: [
        'approval_date',
        'approved_by',
        'audit_notes',
        'business_justification',
        'current_amount',
        'implementation_date',
        'implemented_by',
        'reference_record',
        'reference_table',
        'rejection_reason',
    ],
})
