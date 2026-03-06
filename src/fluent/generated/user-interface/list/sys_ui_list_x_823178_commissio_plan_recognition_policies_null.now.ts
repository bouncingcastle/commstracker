import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_823178_commissio_plan_recognition_policies',
    view: default_view,
    columns: [
        'commission_plan',
        'description',
        'effective_end_date',
        'effective_start_date',
        'is_active',
        'recognition_basis',
        'version_number',
    ],
})
