import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
    view: default_view,
    columns: [
        'created_plan_ids',
        'dry_run',
        'executed_by',
        'executed_on',
        'execution_summary',
        'mode',
        'notes',
        'override_effective_end_date',
        'override_effective_start_date',
        'preview_summary',
    ],
})
