import '@servicenow/sdk/global'
import { Table, StringColumn, IntegerColumn, ReferenceColumn, BooleanColumn } from '@servicenow/sdk/core'

export const x_823178_commissio_deal_classifications = Table({
    name: 'x_823178_commissio_deal_classifications',
    label: 'Deal Classifications',
    schema: {
        deal: ReferenceColumn({
            label: 'Deal',
            referenceTable: 'x_823178_commissio_deals',
            mandatory: true,
            attributes: {
                encode_utf8: false,
            },
        }),
        deal_type_ref: ReferenceColumn({
            label: 'Classification Deal Type',
            referenceTable: 'x_823178_commissio_deal_types',
            mandatory: true,
            attributes: {
                encode_utf8: false,
            },
        }),
        priority: IntegerColumn({
            label: 'Priority',
            mandatory: true,
            default: 100,
        }),
        is_primary: BooleanColumn({
            label: 'Primary Classification',
            default: false,
        }),
        is_active: BooleanColumn({
            label: 'Active',
            default: true,
        }),
        source: StringColumn({
            label: 'Source',
            maxLength: 40,
            default: 'manual',
        }),
        notes: StringColumn({
            label: 'Notes',
            maxLength: 500,
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
            element: 'deal',
        },
        {
            name: 'index2',
            unique: false,
            element: 'deal_type_ref',
        },
    ],
})
