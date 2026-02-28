import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import { mapInvoiceToDeal, validateInvoiceData } from '../../server/business-rules/invoice-management.js'

// Business rule to map invoices to deals
BusinessRule({
    $id: Now.ID['invoice_mapping'],
    name: 'Invoice to Deal Mapping',
    table: 'x_823178_commissio_invoices',
    action: ['insert', 'update'],
    when: 'before',
    script: mapInvoiceToDeal,
    active: true,
    order: 100,
    description: 'Maps invoices to deals using Bigin Deal ID'
})

// Business rule to validate invoice data
BusinessRule({
    $id: Now.ID['invoice_validation'],
    name: 'Invoice Validation',
    table: 'x_823178_commissio_invoices',
    action: ['insert', 'update'],
    when: 'before',
    script: validateInvoiceData,
    active: true,
    order: 50,
    description: 'Validates invoice data integrity'
})