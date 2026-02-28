import '@servicenow/sdk/global'
import { Table, StringColumn, DateColumn, DecimalColumn, DateTimeColumn, ReferenceColumn, BooleanColumn } from '@servicenow/sdk/core'

// Invoices table to sync with Zoho Books
export const x_823178_commissio_invoices = Table({
    name: 'x_823178_commissio_invoices',
    label: 'Invoices',
    schema: {
        books_invoice_id: StringColumn({ 
            label: 'Books Invoice ID',
            mandatory: true,
            maxLength: 100
        }),
        bigin_deal_id: StringColumn({ 
            label: 'Bigin Deal ID (Required)',
            mandatory: true,
            maxLength: 100
        }),
        deal: ReferenceColumn({ 
            label: 'Deal',
            referenceTable: 'x_823178_commissio_deals'
        }),
        invoice_number: StringColumn({ 
            label: 'Invoice Number',
            maxLength: 100
        }),
        customer_name: StringColumn({ 
            label: 'Customer Name',
            maxLength: 255
        }),
        invoice_date: DateColumn({ 
            label: 'Invoice Date'
        }),
        subtotal: DecimalColumn({ 
            label: 'Subtotal (Commission Base)'
        }),
        tax_amount: DecimalColumn({ 
            label: 'Tax Amount'
        }),
        total_amount: DecimalColumn({ 
            label: 'Total Amount'
        }),
        status: StringColumn({ 
            label: 'Status',
            choices: {
                draft: { label: 'Draft', sequence: 0 },
                sent: { label: 'Sent', sequence: 1 },
                partially_paid: { label: 'Partially Paid', sequence: 2 },
                paid: { label: 'Paid', sequence: 3 },
                overdue: { label: 'Overdue', sequence: 4 },
                void: { label: 'Void', sequence: 5 }
            }
        }),
        is_mapped: BooleanColumn({ 
            label: 'Is Mapped to Deal'
        }),
        mapping_error: StringColumn({ 
            label: 'Mapping Error',
            maxLength: 500
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
        })
    },
    audit: true,
    accessible_from: 'package_private'
})