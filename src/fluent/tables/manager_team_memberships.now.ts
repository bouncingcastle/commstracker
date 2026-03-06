import '@servicenow/sdk/global'
import { Table, StringColumn, DateColumn, DateTimeColumn, ReferenceColumn, BooleanColumn } from '@servicenow/sdk/core'

export const x_823178_commissio_manager_team_memberships = Table({
    name: 'x_823178_commissio_manager_team_memberships',
    label: 'Manager Team Memberships',
    schema: {
        manager_user: ReferenceColumn({
            label: 'Manager User',
            referenceTable: 'sys_user',
            mandatory: true,
            attributes: {
                encode_utf8: false,
            },
        }),
        sales_rep: ReferenceColumn({
            label: 'Sales Rep',
            referenceTable: 'sys_user',
            mandatory: true,
            attributes: {
                encode_utf8: false,
            },
        }),
        effective_start_date: DateColumn({
            label: 'Effective Start Date',
            mandatory: true,
        }),
        effective_end_date: DateColumn({
            label: 'Effective End Date',
        }),
        is_active: BooleanColumn({
            label: 'Active',
            default: true,
        }),
        governance_source: StringColumn({
            label: 'Governance Source',
            choices: {
                manual: { label: 'Manual', sequence: 0 },
                import: { label: 'Import', sequence: 1 },
                hr_sync: { label: 'HR Sync', sequence: 2 },
            },
            default: 'manual',
            dropdown: 'dropdown_with_none',
        }),
        approved_by: ReferenceColumn({
            label: 'Approved By',
            referenceTable: 'sys_user',
            attributes: {
                encode_utf8: false,
            },
        }),
        approved_on: DateTimeColumn({
            label: 'Approved On',
        }),
        notes: StringColumn({
            label: 'Notes',
            maxLength: 1000,
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
            element: 'approved_by',
        },
        {
            name: 'index2',
            unique: false,
            element: 'manager_user',
        },
        {
            name: 'index3',
            unique: false,
            element: 'sales_rep',
        },
    ],
})
