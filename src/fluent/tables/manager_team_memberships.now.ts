import '@servicenow/sdk/global'
import { Table, StringColumn, DateColumn, DateTimeColumn, ReferenceColumn, BooleanColumn } from '@servicenow/sdk/core'

export const x_823178_commissio_manager_team_memberships = Table({
    name: 'x_823178_commissio_manager_team_memberships',
    label: 'Manager Team Memberships',
    schema: {
        manager_user: ReferenceColumn({
            label: 'Manager User',
            referenceTable: 'sys_user',
            mandatory: true
        }),
        sales_rep: ReferenceColumn({
            label: 'Sales Rep',
            referenceTable: 'sys_user',
            mandatory: true
        }),
        effective_start_date: DateColumn({
            label: 'Effective Start Date',
            mandatory: true
        }),
        effective_end_date: DateColumn({
            label: 'Effective End Date'
        }),
        is_active: BooleanColumn({
            label: 'Active',
            default: true
        }),
        governance_source: StringColumn({
            label: 'Governance Source',
            choices: {
                manual: { label: 'Manual', sequence: 0 },
                import: { label: 'Import', sequence: 1 },
                hr_sync: { label: 'HR Sync', sequence: 2 }
            },
            default: 'manual'
        }),
        approved_by: ReferenceColumn({
            label: 'Approved By',
            referenceTable: 'sys_user'
        }),
        approved_on: DateTimeColumn({
            label: 'Approved On'
        }),
        notes: StringColumn({
            label: 'Notes',
            maxLength: 1000
        })
    },
    indexes: [
        {
            name: 'idx_manager_team_scope',
            fields: ['manager_user', 'sales_rep', 'is_active']
        },
        {
            name: 'idx_manager_team_effective',
            fields: ['manager_user', 'effective_start_date', 'effective_end_date']
        }
    ],
    audit: true,
    accessible_from: 'public',
    caller_access: 'tracking',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true
})
