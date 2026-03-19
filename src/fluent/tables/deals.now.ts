import '@servicenow/sdk/global'
import {
    Table,
    StringColumn,
    DecimalColumn,
    DateColumn,
    DateTimeColumn,
    ReferenceColumn,
    BooleanColumn,
} from '@servicenow/sdk/core'

// Enhanced Deals table with web service access and audit controls
export const x_823178_commissio_deals = Table({
    name: 'x_823178_commissio_deals',
    label: 'Deals',
    schema: {
        bigin_deal_id: StringColumn({
            label: 'Bigin Deal ID',
            mandatory: true,
            maxLength: 100,
        }),
        deal_name: StringColumn({
            label: 'Deal Name',
            maxLength: 255,
        }),
        account_name: StringColumn({
            label: 'Account Name',
            maxLength: 255,
        }),
        owner_at_close: ReferenceColumn({
            label: 'Owner at Close (Snapshot)',
            referenceTable: 'sys_user',
            attributes: {
                encode_utf8: false,
            },
        }),
        current_owner: ReferenceColumn({
            label: 'Current Owner',
            referenceTable: 'sys_user',
            attributes: {
                encode_utf8: false,
            },
        }),
        amount: DecimalColumn({
            label: 'Deal Amount',
        }),
        close_date: DateColumn({
            label: 'Close Date',
        }),
        stage: StringColumn({
            label: 'Stage',
            choices: {
                lead: { label: 'Lead', sequence: 0 },
                qualified: { label: 'Qualified', sequence: 1 },
                proposal: { label: 'Proposal', sequence: 2 },
                negotiation: { label: 'Negotiation', sequence: 3 },
                closed_won: { label: 'Closed Won', sequence: 4 },
                closed_lost: { label: 'Closed Lost', sequence: 5 },
            },
            dropdown: 'dropdown_with_none',
        }),
        deal_type_ref: ReferenceColumn({
            label: 'Primary Deal Type',
            referenceTable: 'x_823178_commissio_deal_types',
            mandatory: true,
            attributes: {
                encode_utf8: false,
            },
        }),
        is_won: BooleanColumn({
            label: 'Is Won',
        }),
        snapshot_taken: BooleanColumn({
            label: 'Snapshot Taken',
        }),
        snapshot_timestamp: DateTimeColumn({
            label: 'Snapshot Timestamp',
            readOnly: true,
        }),
        snapshot_immutable: BooleanColumn({
            label: 'Snapshot Immutable',
            default: false,
            readOnly: true,
        }),
        last_owner_change: DateTimeColumn({
            label: 'Last Owner Change',
        }),
        owner_change_reason: StringColumn({
            label: 'Owner Change Reason',
            maxLength: 500,
        }),
        commission_calculations_count: StringColumn({
            label: 'Commission Calculations Count',
            readOnly: true,
            default: '0',
        }),
        last_sync: DateTimeColumn({
            label: 'Last Sync from Bigin',
        }),
        sync_status: StringColumn({
            label: 'Sync Status',
            choices: {
                synced: { label: 'Synced', sequence: 0 },
                error: { label: 'Error', sequence: 1 },
                pending: { label: 'Pending', sequence: 2 },
            },
            default: 'pending',
            dropdown: 'dropdown_with_none',
        }),
        sync_error_details: StringColumn({
            label: 'Sync Error Details',
            maxLength: 1000,
        }),
        requires_finance_approval: BooleanColumn({
            label: 'Requires Finance Approval',
            default: false,
        }),
        finance_approved: BooleanColumn({
            label: 'Finance Approved',
            default: false,
        }),
        finance_approved_by: ReferenceColumn({
            label: 'Finance Approved By',
            referenceTable: 'sys_user',
            attributes: {
                encode_utf8: false,
            },
        }),
        finance_approval_date: DateTimeColumn({
            label: 'Finance Approval Date',
        }),
        deal_type: StringColumn({
            choices: {
                upsell: {
                    label: 'Upsell',
                    sequence: 3,
                },
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
            },
            dropdown: 'dropdown_with_none',
            label: 'Deal Type',
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
            element: 'current_owner',
        },
        {
            name: 'index3',
            unique: false,
            element: 'finance_approved_by',
        },
        {
            name: 'index4',
            unique: false,
            element: 'owner_at_close',
        },
        {
            name: 'index2',
            unique: false,
            element: 'deal_type_ref',
        },
    ],
})
