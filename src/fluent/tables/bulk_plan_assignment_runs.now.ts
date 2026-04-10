import '@servicenow/sdk/global'
import { Table, StringColumn, DateColumn, DateTimeColumn, ReferenceColumn, BooleanColumn } from '@servicenow/sdk/core'

export const x_823178_commissio_bulk_plan_assignment_runs = Table({
    name: 'x_823178_commissio_bulk_plan_assignment_runs',
    label: 'Bulk Plan Assignment Runs',
    schema: {
        run_name: StringColumn({
            label: 'Run Name',
            maxLength: 120,
            mandatory: true,
        }),
        source_plan: ReferenceColumn({
            label: 'Source Plan Template',
            referenceTable: 'x_823178_commissio_commission_plans',
            mandatory: true,
            attributes: {
                encode_utf8: false,
            },
        }),
        target_user_ids: StringColumn({
            label: 'Target User Sys IDs (comma-separated)',
            maxLength: 4000,
            mandatory: true,
        }),
        mode: StringColumn({
            label: 'Execution Mode',
            choices: {
                preview: { label: 'Preview', sequence: 0 },
                apply: { label: 'Apply', sequence: 1 },
                rollback: { label: 'Rollback', sequence: 2 },
            },
            default: 'preview',
            mandatory: true,
            dropdown: 'dropdown_with_none',
        }),
        status: StringColumn({
            label: 'Status',
            choices: {
                draft: { label: 'Draft', sequence: 0 },
                previewed: { label: 'Previewed', sequence: 1 },
                applied: { label: 'Applied', sequence: 2 },
                rolled_back: { label: 'Rolled Back', sequence: 3 },
                error: { label: 'Error', sequence: 4 },
            },
            default: 'draft',
            dropdown: 'dropdown_with_none',
        }),
        override_effective_start_date: DateColumn({
            label: 'Override Effective Start Date',
        }),
        override_effective_end_date: DateColumn({
            label: 'Override Effective End Date',
        }),
        dry_run: BooleanColumn({
            label: 'Dry Run',
            default: true,
        }),
        preview_summary: StringColumn({
            label: 'Preview Summary (JSON)',
            maxLength: 4000,
            readOnly: true,
        }),
        execution_summary: StringColumn({
            label: 'Execution Summary (JSON)',
            maxLength: 4000,
            readOnly: true,
        }),
        created_plan_ids: StringColumn({
            label: 'Created Plan IDs (comma-separated)',
            maxLength: 4000,
            readOnly: true,
        }),
        rollback_summary: StringColumn({
            label: 'Rollback Summary (JSON)',
            maxLength: 4000,
            readOnly: true,
        }),
        executed_by: ReferenceColumn({
            label: 'Executed By',
            referenceTable: 'sys_user',
            readOnly: true,
            attributes: {
                encode_utf8: false,
            },
        }),
        executed_on: DateTimeColumn({
            label: 'Executed On',
            readOnly: true,
        }),
        notes: StringColumn({
            label: 'Notes',
            maxLength: 2000,
        }),
    },
    audit: true,
    accessibleFrom: 'public',
    callerAccess: 'tracking',
    actions: ['read', 'update', 'delete', 'create'],
    allowWebServiceAccess: true,
    index: [
        {
            name: 'index',
            unique: false,
            element: 'executed_by',
        },
        {
            name: 'index2',
            unique: false,
            element: 'source_plan',
        },
    ],
})
