import '@servicenow/sdk/global'
import { Table, StringColumn, DateColumn, DecimalColumn, DateTimeColumn, ReferenceColumn, BooleanColumn } from '@servicenow/sdk/core'

// Enhanced Commission Calculations table with web service access
export const x_823178_commissio_commission_calculations = Table({
    name: 'x_823178_commissio_commission_calculations',
    label: 'Commission Calculations',
    schema: {
        payment: ReferenceColumn({ 
            label: 'Payment',
            referenceTable: 'x_823178_commissio_payments',
            mandatory: true
        }),
        deal: ReferenceColumn({ 
            label: 'Deal',
            referenceTable: 'x_823178_commissio_deals'
        }),
        invoice: ReferenceColumn({ 
            label: 'Invoice',
            referenceTable: 'x_823178_commissio_invoices'
        }),
        sales_rep: ReferenceColumn({ 
            label: 'Sales Rep (Commission Owner)',
            referenceTable: 'sys_user',
            mandatory: true
        }),
        commission_plan: ReferenceColumn({ 
            label: 'Commission Plan Used',
            referenceTable: 'x_823178_commissio_commission_plans'
        }),
        commission_base_amount: DecimalColumn({ 
            label: 'Commission Base Amount'
        }),
        commission_rate: DecimalColumn({ 
            label: 'Commission Rate (%)'
        }),
        effective_tier_name: StringColumn({
            label: 'Effective Tier Name',
            maxLength: 120,
            read_only: true
        }),
        effective_tier_floor_percent: DecimalColumn({
            label: 'Effective Tier Floor (%)',
            read_only: true
        }),
        attainment_percent_at_calc: DecimalColumn({
            label: 'Attainment (%) at Calculation',
            read_only: true
        }),
        quota_amount_snapshot: DecimalColumn({
            label: 'Quota Amount Snapshot',
            read_only: true
        }),
        attained_amount_snapshot: DecimalColumn({
            label: 'Attained Amount Snapshot',
            read_only: true
        }),
        accelerator_applied: BooleanColumn({
            label: 'Accelerator Applied',
            default: false,
            read_only: true
        }),
        bonus_amount: DecimalColumn({
            label: 'Bonus Amount',
            read_only: true
        }),
        bonus_earned_count: StringColumn({
            label: 'Bonus Earned Count',
            maxLength: 10,
            default: '0',
            read_only: true
        }),
        commission_amount: DecimalColumn({ 
            label: 'Commission Amount'
        }),
        payment_date: DateColumn({ 
            label: 'Payment Date (Cash Received)'
        }),
        recognition_date_snapshot: DateColumn({
            label: 'Recognition Date Snapshot',
            read_only: true
        }),
        temporal_lookup_date_snapshot: DateColumn({
            label: 'Temporal Lookup Date Snapshot',
            read_only: true
        }),
        recognition_basis_snapshot: StringColumn({
            label: 'Recognition Basis Snapshot',
            maxLength: 40,
            read_only: true
        }),
        recognition_policy_version_snapshot: StringColumn({
            label: 'Recognition Policy Version Snapshot',
            maxLength: 40,
            read_only: true
        }),
        recognition_policy_record: ReferenceColumn({
            label: 'Recognition Policy Record',
            referenceTable: 'x_823178_commissio_plan_recognition_policies',
            read_only: true
        }),
        payout_eligible_date: DateColumn({
            label: 'Payout Eligible Date'
        }),
        deal_close_date: DateColumn({ 
            label: 'Deal Close Date (Snapshot)'
        }),
        calculation_date: DateTimeColumn({ 
            label: 'Calculation Date'
        }),
        deal_type: StringColumn({ 
            label: 'Deal Type',
            maxLength: 40
        }),
        is_negative: BooleanColumn({ 
            label: 'Is Refund/Negative Entry'
        }),
        statement: ReferenceColumn({ 
            label: 'Commission Statement',
            referenceTable: 'x_823178_commissio_commission_statements'
        }),
        status: StringColumn({ 
            label: 'Status',
            choices: {
                draft: { label: 'Draft', sequence: 0 },
                locked: { label: 'Locked', sequence: 1 },
                paid: { label: 'Paid', sequence: 2 },
                disputed: { label: 'Disputed', sequence: 3 },
                error: { label: 'Error', sequence: 4 }
            },
            default: 'draft'
        }),
        calculation_inputs: StringColumn({ 
            label: 'Calculation Inputs (JSON)',
            maxLength: 4000,
            read_only: true
        }),
        calculation_hash: StringColumn({ 
            label: 'Calculation Hash',
            maxLength: 64,
            read_only: true
        }),
        recalculated_count: StringColumn({ 
            label: 'Recalculation Count',
            default: '0',
            read_only: true
        }),
        last_recalculated: DateTimeColumn({ 
            label: 'Last Recalculated'
        }),
        original_calculation_date: DateTimeColumn({ 
            label: 'Original Calculation Date',
            read_only: true
        }),
        requires_approval: BooleanColumn({ 
            label: 'Requires Approval',
            default: false
        }),
        approved: BooleanColumn({ 
            label: 'Approved',
            default: false
        }),
        approved_by: ReferenceColumn({ 
            label: 'Approved By',
            referenceTable: 'sys_user'
        }),
        approval_date: DateTimeColumn({ 
            label: 'Approval Date'
        }),
        dispute_reason: StringColumn({ 
            label: 'Dispute Reason',
            maxLength: 1000
        }),
        dispute_opened_by: ReferenceColumn({ 
            label: 'Dispute Opened By',
            referenceTable: 'sys_user'
        }),
        dispute_opened_date: DateTimeColumn({ 
            label: 'Dispute Opened Date'
        }),
        dispute_resolved_by: ReferenceColumn({ 
            label: 'Dispute Resolved By',
            referenceTable: 'sys_user'
        }),
        dispute_resolved_date: DateTimeColumn({ 
            label: 'Dispute Resolved Date'
        }),
        notes: StringColumn({ 
            label: 'Notes',
            maxLength: 1000
        }),
        payout_schedule_snapshot: StringColumn({
            label: 'Payout Schedule Snapshot',
            maxLength: 500,
            read_only: true
        }),
        bonus_summary_snapshot: StringColumn({
            label: 'Bonus Summary Snapshot',
            maxLength: 1000,
            read_only: true
        })
    },
    audit: true,
    accessible_from: 'public',
    caller_access: 'tracking',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true
})