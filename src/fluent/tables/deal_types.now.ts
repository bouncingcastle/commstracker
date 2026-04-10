import '@servicenow/sdk/global'
import { Table, StringColumn, IntegerColumn, BooleanColumn } from '@servicenow/sdk/core'

export const x_823178_commissio_deal_types = Table({
    name: 'x_823178_commissio_deal_types',
    label: 'Deal Types',
    schema: {
        code: StringColumn({
            label: 'Code',
            maxLength: 40,
            mandatory: true,
        }),
        name: StringColumn({
            label: 'Name',
            maxLength: 100,
            mandatory: true,
        }),
        description: StringColumn({
            label: 'Description',
            maxLength: 500,
        }),
        sort_order: IntegerColumn({
            label: 'Sort Order',
        }),
        is_active: BooleanColumn({
            label: 'Active',
            default: true,
        }),
        is_system: BooleanColumn({
            label: 'System Record',
            default: false,
        }),
    },
    audit: true,
    accessibleFrom: 'public',
    callerAccess: 'tracking',
    actions: ['read', 'update', 'delete', 'create'],
    allowWebServiceAccess: true,
})
