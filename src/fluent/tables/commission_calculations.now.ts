import '@servicenow/sdk/global'
import {
    Table,
    StringColumn,
    DateColumn,
    DecimalColumn,
    DateTimeColumn,
    ReferenceColumn,
    BooleanColumn,
} from '@servicenow/sdk/core'

// Enhanced Commission Calculations table with web service access
export const x_823178_commissio_commission_calculations = Table({
    name: 'x_823178_commissio_commission_calculations',
    label: 'Commission Calculations',
    schema: {
        payment: ReferenceColumn({
            label: 'Payment',
            referenceTable: 'x_823178_commissio_payments',
            mandatory: true,
            attributes: {
                encode_utf8: false,
            },
        }),
        deal: ReferenceColumn({
            label: 'Deal',
            referenceTable: 'x_823178_commissio_deals',
            attributes: {
                encode_utf8: false,
            },
        }),
        invoice: ReferenceColumn({
            label: 'Invoice',
            referenceTable: 'x_823178_commissio_invoices',
            attributes: {
                encode_utf8: false,
            },
        }),
        sales_rep: ReferenceColumn({
            label: 'Sales Rep (Commission Owner)',
            referenceTable: 'sys_user',
            mandatory: true,
            attributes: {
                encode_utf8: false,
            },
        }),
        commission_plan: ReferenceColumn({
            label: 'Commission Plan Used',
            referenceTable: 'x_823178_commissio_commission_plans',
            attributes: {
                encode_utf8: false,
            },
        }),
        commission_base_amount: DecimalColumn({
            label: 'Commission Base Amount',
        }),
        commission_rate: DecimalColumn({
            label: 'Commission Rate (%)',
        }),
        effective_tier_name: StringColumn({
            label: 'Effective Tier Name',
            maxLength: 120,
            readOnly: true,
        }),
        effective_tier_floor_percent: DecimalColumn({
            label: 'Effective Tier Floor (%)',
            readOnly: true,
        }),
        attainment_percent_at_calc: DecimalColumn({
            label: 'Attainment (%) at Calculation',
            readOnly: true,
        }),
        quota_amount_snapshot: DecimalColumn({
            label: 'Quota Amount Snapshot',
            readOnly: true,
        }),
        attained_amount_snapshot: DecimalColumn({
            label: 'Attained Amount Snapshot',
            readOnly: true,
        }),
        accelerator_applied: BooleanColumn({
            label: 'Accelerator Applied',
            default: false,
            readOnly: true,
        }),
        bonus_amount: DecimalColumn({
            label: 'Bonus Amount',
            readOnly: true,
        }),
        bonus_earned_count: StringColumn({
            label: 'Bonus Earned Count',
            default: '0',
            readOnly: true,
        }),
        base_commission_component: DecimalColumn({
            label: 'Base Commission Component',
            readOnly: true,
        }),
        accelerator_delta_component: DecimalColumn({
            label: 'Accelerator Delta Component',
            readOnly: true,
        }),
        bonus_component: DecimalColumn({
            label: 'Bonus Component',
            readOnly: true,
        }),
        commission_amount: DecimalColumn({
            label: 'Commission Amount',
        }),
        payment_date: DateColumn({
            label: 'Payment Date (Cash Received)',
        }),
        recognition_date_snapshot: DateColumn({
            label: 'Recognition Date Snapshot',
            readOnly: true,
        }),
        temporal_lookup_date_snapshot: DateColumn({
            label: 'Temporal Lookup Date Snapshot',
            readOnly: true,
        }),
        recognition_basis_snapshot: StringColumn({
            label: 'Recognition Basis Snapshot',
            maxLength: 40,
            readOnly: true,
        }),
        recognition_policy_version_snapshot: StringColumn({
            label: 'Recognition Policy Version Snapshot',
            maxLength: 40,
            readOnly: true,
        }),
        recognition_policy_record: ReferenceColumn({
            label: 'Recognition Policy Record',
            referenceTable: 'x_823178_commissio_plan_recognition_policies',
            readOnly: true,
            attributes: {
                encode_utf8: false,
            },
        }),
        payout_eligible_date: DateColumn({
            label: 'Payout Eligible Date',
        }),
        deal_close_date: DateColumn({
            label: 'Deal Close Date (Snapshot)',
        }),
        deal_type_ref: ReferenceColumn({
            label: 'Deal Type (Reference)',
            referenceTable: 'x_823178_commissio_deal_types',
            readOnly: true,
            attributes: {
                encode_utf8: false,
            },
        }),
        calculation_date: DateTimeColumn({
            label: 'Calculation Date',
        }),
        is_negative: BooleanColumn({
            label: 'Is Refund/Negative Entry',
        }),
        statement: ReferenceColumn({
            label: 'Commission Statement',
            referenceTable: 'x_823178_commissio_commission_statements',
            attributes: {
                encode_utf8: false,
            },
        }),
        status: StringColumn({
            label: 'Status',
            choices: {
                draft: { label: 'Draft', sequence: 0 },
                locked: { label: 'Locked', sequence: 1 },
                paid: { label: 'Paid', sequence: 2 },
                disputed: { label: 'Disputed', sequence: 3 },
                error: { label: 'Error', sequence: 4 },
            },
            default: 'draft',
            dropdown: 'dropdown_with_none',
        }),
        calculation_inputs: StringColumn({
            label: 'Calculation Inputs (JSON)',
            maxLength: 4000,
            readOnly: true,
        }),
        calculation_hash: StringColumn({
            label: 'Calculation Hash',
            maxLength: 64,
            readOnly: true,
        }),
        recalculated_count: StringColumn({
            label: 'Recalculation Count',
            default: '0',
            readOnly: true,
        }),
        last_recalculated: DateTimeColumn({
            label: 'Last Recalculated',
        }),
        original_calculation_date: DateTimeColumn({
            label: 'Original Calculation Date',
            readOnly: true,
        }),
        requires_approval: BooleanColumn({
            label: 'Requires Approval',
            default: false,
        }),
        approved: BooleanColumn({
            label: 'Approved',
            default: false,
        }),
        approved_by: ReferenceColumn({
            label: 'Approved By',
            referenceTable: 'sys_user',
            attributes: {
                encode_utf8: false,
            },
        }),
        approval_date: DateTimeColumn({
            label: 'Approval Date',
        }),
        dispute_reason: StringColumn({
            label: 'Dispute Reason',
            maxLength: 1000,
        }),
        dispute_opened_by: ReferenceColumn({
            label: 'Dispute Opened By',
            referenceTable: 'sys_user',
            attributes: {
                encode_utf8: false,
            },
        }),
        dispute_opened_date: DateTimeColumn({
            label: 'Dispute Opened Date',
        }),
        dispute_resolved_by: ReferenceColumn({
            label: 'Dispute Resolved By',
            referenceTable: 'sys_user',
            attributes: {
                encode_utf8: false,
            },
        }),
        dispute_resolved_date: DateTimeColumn({
            label: 'Dispute Resolved Date',
        }),
        notes: StringColumn({
            label: 'Notes',
            maxLength: 1000,
        }),
        payout_schedule_snapshot: StringColumn({
            label: 'Payout Schedule Snapshot',
            maxLength: 500,
            readOnly: true,
        }),
        bonus_summary_snapshot: StringColumn({
            label: 'Bonus Summary Snapshot',
            maxLength: 1000,
            readOnly: true,
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
            element: 'commission_plan',
        },
        {
            name: 'index2',
            unique: false,
            element: 'deal',
        },
        {
            name: 'index3',
            unique: false,
            element: 'deal_type_ref',
        },
        {
            name: 'index4',
            unique: false,
            element: 'invoice',
        },
        {
            name: 'index5',
            unique: false,
            element: 'approved_by',
        },
        {
            name: 'index6',
            unique: false,
            element: 'payment',
        },
        {
            name: 'index7',
            unique: false,
            element: 'dispute_opened_by',
        },
        {
            name: 'index8',
            unique: false,
            element: 'sales_rep',
        },
        {
            name: 'index9',
            unique: false,
            element: 'statement',
        },
        {
            name: 'index10',
            unique: false,
            element: 'recognition_policy_record',
        },
        {
            name: 'index11',
            unique: false,
            element: 'dispute_resolved_by',
        },
    ],
})
