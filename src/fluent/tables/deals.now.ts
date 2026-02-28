import '@servicenow/sdk/global'
import { Table, StringColumn, DecimalColumn, DateTimeColumn, ReferenceColumn, BooleanColumn } from '@servicenow/sdk/core'

// Enhanced Deals table with web service access and audit controls
export const x_823178_commissio_deals = Table({
    name: 'x_823178_commissio_deals',
    label: 'Deals',
    schema: {
        bigin_deal_id: StringColumn({ 
            label: 'Bigin Deal ID',
            mandatory: true,
            maxLength: 100
        }),
        deal_name: StringColumn({ 
            label: 'Deal Name',
            maxLength: 255
        }),
        account_name: StringColumn({ 
            label: 'Account Name',
            maxLength: 255
        }),
        owner_at_close: ReferenceColumn({ 
            label: 'Owner at Close (Snapshot)',
            referenceTable: 'sys_user'
        }),
        current_owner: ReferenceColumn({ 
            label: 'Current Owner',
            referenceTable: 'sys_user'
        }),
        amount: DecimalColumn({ 
            label: 'Deal Amount'
        }),
        close_date: StringColumn({ 
            label: 'Close Date',
            maxLength: 10
        }),
        stage: StringColumn({ 
            label: 'Stage',
            choices: {
                lead: { label: 'Lead', sequence: 0 },
                qualified: { label: 'Qualified', sequence: 1 },
                proposal: { label: 'Proposal', sequence: 2 },
                negotiation: { label: 'Negotiation', sequence: 3 },
                closed_won: { label: 'Closed Won', sequence: 4 },
                closed_lost: { label: 'Closed Lost', sequence: 5 }
            }
        }),
        deal_type: StringColumn({ 
            label: 'Deal Type',
            choices: {
                new_business: { label: 'New Business', sequence: 0 },
                renewal: { label: 'Renewal', sequence: 1 },
                expansion: { label: 'Expansion', sequence: 2 },
                upsell: { label: 'Upsell', sequence: 3 }
            }
        }),
        is_won: BooleanColumn({ 
            label: 'Is Won'
        }),
        snapshot_taken: BooleanColumn({ 
            label: 'Snapshot Taken'
        }),
        snapshot_timestamp: DateTimeColumn({ 
            label: 'Snapshot Timestamp',
            read_only: true
        }),
        snapshot_immutable: BooleanColumn({ 
            label: 'Snapshot Immutable',
            default: false,
            read_only: true
        }),
        last_owner_change: DateTimeColumn({ 
            label: 'Last Owner Change'
        }),
        owner_change_reason: StringColumn({ 
            label: 'Owner Change Reason',
            maxLength: 500
        }),
        commission_calculations_count: StringColumn({ 
            label: 'Commission Calculations Count',
            read_only: true,
            default: '0'
        }),
        last_sync: DateTimeColumn({ 
            label: 'Last Sync from Bigin'
        }),
        sync_status: StringColumn({ 
            label: 'Sync Status',
            choices: {
                synced: { label: 'Synced', sequence: 0 },
                error: { label: 'Error', sequence: 1 },
                pending: { label: 'Pending', sequence: 2 }
            },
            default: 'pending'
        }),
        sync_error_details: StringColumn({ 
            label: 'Sync Error Details',
            maxLength: 1000
        }),
        requires_finance_approval: BooleanColumn({ 
            label: 'Requires Finance Approval',
            default: false
        }),
        finance_approved: BooleanColumn({ 
            label: 'Finance Approved',
            default: false
        }),
        finance_approved_by: ReferenceColumn({ 
            label: 'Finance Approved By',
            referenceTable: 'sys_user'
        }),
        finance_approval_date: DateTimeColumn({ 
            label: 'Finance Approval Date'
        })
    },
    audit: true,
    accessible_from: 'public',
    caller_access: 'tracking',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true
})