import '@servicenow/sdk/global'
import { Table, StringColumn, DateColumn, DecimalColumn, DateTimeColumn, ReferenceColumn, BooleanColumn } from '@servicenow/sdk/core'

// Enhanced Payments table with validation and audit controls
export const x_823178_commissio_payments = Table({
    name: 'x_823178_commissio_payments',
    label: 'Payments',
    schema: {
        books_payment_id: StringColumn({ 
            label: 'Books Payment ID',
            mandatory: true,
            maxLength: 100
        }),
        invoice: ReferenceColumn({ 
            label: 'Invoice',
            referenceTable: 'x_823178_commissio_invoices',
            mandatory: true
        }),
        deal: ReferenceColumn({ 
            label: 'Deal',
            referenceTable: 'x_823178_commissio_deals'
        }),
        payment_date: DateColumn({ 
            label: 'Payment Date (Cash Received)'
        }),
        payment_amount: DecimalColumn({ 
            label: 'Payment Amount'
        }),
        payment_method: StringColumn({ 
            label: 'Payment Method',
            choices: {
                check: { label: 'Check', sequence: 0 },
                wire: { label: 'Wire Transfer', sequence: 1 },
                credit_card: { label: 'Credit Card', sequence: 2 },
                ach: { label: 'ACH', sequence: 3 },
                cash: { label: 'Cash', sequence: 4 },
                other: { label: 'Other', sequence: 5 }
            }
        }),
        payment_type: StringColumn({ 
            label: 'Payment Type',
            choices: {
                payment: { label: 'Payment', sequence: 0 },
                refund: { label: 'Refund', sequence: 1 }
            },
            default: 'payment'
        }),
        reference_number: StringColumn({ 
            label: 'Reference Number',
            maxLength: 100
        }),
        commission_calculated: StringColumn({ 
            label: 'Commission Status',
            choices: {
                pending: { label: 'Pending', sequence: 0 },
                calculated: { label: 'Calculated', sequence: 1 },
                error: { label: 'Error', sequence: 2 },
                locked: { label: 'Locked', sequence: 3 }
            },
            default: 'pending'
        }),
        // SAFEGUARD: New validation and audit fields
        commission_calculation_id: ReferenceColumn({ 
            label: 'Commission Calculation',
            referenceTable: 'x_823178_commissio_commission_calculations'
        }),
        payment_amount_validation: StringColumn({ 
            label: 'Amount Validation Status',
            choices: {
                valid: { label: 'Valid', sequence: 0 },
                warning: { label: 'Warning - Over Invoice', sequence: 1 },
                error: { label: 'Error - Invalid Amount', sequence: 2 }
            },
            default: 'valid'
        }),
        validation_notes: StringColumn({ 
            label: 'Validation Notes',
            maxLength: 500
        }),
        // SAFEGUARD: Concurrency control
        calculation_lock: BooleanColumn({ 
            label: 'Calculation Locked',
            default: false,
            read_only: true
        }),
        calculation_lock_timestamp: DateTimeColumn({ 
            label: 'Calculation Lock Timestamp',
            read_only: true
        }),
        // SAFEGUARD: Reconciliation tracking
        books_reconciled: BooleanColumn({ 
            label: 'Reconciled with Books',
            default: false
        }),
        reconciliation_date: DateTimeColumn({ 
            label: 'Reconciliation Date'
        }),
        reconciliation_variance: DecimalColumn({ 
            label: 'Reconciliation Variance'
        }),
        last_sync: DateTimeColumn({ 
            label: 'Last Sync from Books'
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
        })
    },
    audit: true,
    accessible_from: 'package_private'
})