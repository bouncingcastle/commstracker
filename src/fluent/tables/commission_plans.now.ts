import '@servicenow/sdk/global'
import {
    Table,
    StringColumn,
    DecimalColumn,
    DateColumn,
    ReferenceColumn,
    BooleanColumn,
    IntegerColumn,
} from '@servicenow/sdk/core'

export const x_823178_commissio_commission_plans = Table({
    name: 'x_823178_commissio_commission_plans',
    label: 'Commission Plans',
    schema: {
        plan_name: StringColumn({
            label: 'Plan Name',
            maxLength: 255,
            mandatory: false,
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
            label: 'Is Active',
            mandatory: false,
            default: true,
        }),
        lifecycle_state: StringColumn({
            label: 'Lifecycle State',
            choices: {
                draft: { label: 'Draft', sequence: 0 },
                active: { label: 'Active', sequence: 1 },
                retired: { label: 'Retired', sequence: 2 },
                superseded: { label: 'Superseded', sequence: 3 },
            },
            mandatory: true,
            dropdown: 'dropdown_with_none',
        }),
        plan_version: IntegerColumn({
            label: 'Plan Version',
            mandatory: true,
            default: 1,
        }),
        supersedes_plan: ReferenceColumn({
            label: 'Supersedes Plan',
            referenceTable: 'x_823178_commissio_commission_plans',
            attributes: {
                encode_utf8: false,
            },
        }),
        superseded_by_plan: ReferenceColumn({
            label: 'Superseded By Plan',
            referenceTable: 'x_823178_commissio_commission_plans',
            readOnly: true,
            attributes: {
                encode_utf8: false,
            },
        }),
        upsell_rate: DecimalColumn({
            label: 'Upsell Rate (%)',
            scale: 2,
            default: '',
        }),
        base_rate: DecimalColumn({
            label: 'Base Rate (%)',
            scale: 2,
            default: 5,
        }),
        description: StringColumn({
            label: 'Description',
            maxLength: 500,
        }),
        plan_overlap_approved_by: ReferenceColumn({
            label: 'Plan Overlap Approved By',
            referenceTable: 'sys_user',
            readOnly: false,
            attributes: {
                encode_utf8: false,
            },
        }),
        plan_overlap_approved_on: DateColumn({
            label: 'Plan Overlap Approved On',
            readOnly: false,
        }),
        plan_overlap_reason: StringColumn({
            label: 'Plan Overlap Reason',
            maxLength: 500,
            readOnly: false,
        }),
        new_business_rate: DecimalColumn({
            scale: 2,
            label: 'New Business Rate (%)',
        }),
        plan_target_amount: DecimalColumn({
            scale: 2,
            label: 'Plan Target Commission Amount',
        }),
        renewal_rate: DecimalColumn({
            scale: 2,
            label: 'Renewal Rate (%)',
        }),
        deal_type: StringColumn({
            choices: {
                new_business: {
                    label: 'New Business',
                    sequence: 0,
                },
                renewal: {
                    label: 'Renewal',
                    sequence: 1,
                },
                expansion: {
                    label: 'Expansion',
                    sequence: 2,
                },
                upsell: {
                    label: 'Upsell',
                    sequence: 3,
                },
            },
            dropdown: 'dropdown_with_none',
            label: 'Deal Type',
        }),
        expansion_rate: DecimalColumn({
            scale: 2,
            label: 'Expansion Rate (%)',
        }),
    },
    audit: true,
    index: [
        {
            name: 'index',
            unique: false,
            element: 'plan_overlap_approved_by',
        },
        {
            name: 'index2',
            unique: false,
            element: 'superseded_by_plan',
        },
        {
            name: 'index3',
            unique: false,
            element: 'sales_rep',
        },
        {
            name: 'index4',
            unique: false,
            element: 'supersedes_plan',
        },
    ],
})
