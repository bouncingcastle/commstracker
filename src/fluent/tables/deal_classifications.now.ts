import '@servicenow/sdk/global'
import { Table, StringColumn, IntegerColumn, ReferenceColumn, BooleanColumn } from '@servicenow/sdk/core'

export const x_823178_commissio_deal_classifications = Table({
    name: 'x_823178_commissio_deal_classifications',
    label: 'Deal Classifications',
    schema: {
        deal: ReferenceColumn({
            label: 'Deal',
            referenceTable: 'x_823178_commissio_deals',
            mandatory: true
        }),
        deal_type: StringColumn({
            label: 'Classification Code',
            maxLength: 40,
            mandatory: true
        }),
        priority: IntegerColumn({
            label: 'Priority',
            mandatory: true,
            default: 100
        }),
        is_primary: BooleanColumn({
            label: 'Primary Classification',
            default: false
        }),
        is_active: BooleanColumn({
            label: 'Active',
            default: true
        }),
        source: StringColumn({
            label: 'Source',
            maxLength: 40,
            default: 'manual'
        }),
        notes: StringColumn({
            label: 'Notes',
            maxLength: 500
        })
    },
    indexes: [
        {
            name: 'idx_deal_classifications_deal',
            fields: ['deal', 'is_active', 'priority']
        },
        {
            name: 'idx_deal_classifications_type',
            fields: ['deal_type']
        }
    ],
    audit: true,
    accessible_from: 'public',
    caller_access: 'tracking',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true
})
