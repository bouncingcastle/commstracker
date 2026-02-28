import { gs, GlideRecord } from '@servicenow/glide'

export function mapInvoiceToDeal(current, previous) {
    // Map invoice to deal using Bigin Deal ID
    if (current.getValue('bigin_deal_id') && !current.getValue('deal')) {
        var dealGr = new GlideRecord('x_823178_commissio_deals');
        dealGr.addQuery('bigin_deal_id', current.getValue('bigin_deal_id'));
        dealGr.query();
        
        if (dealGr.next()) {
            current.setValue('deal', dealGr.sys_id);
            current.setValue('is_mapped', true);
            current.setValue('mapping_error', '');
            gs.info('Commission Management: Invoice mapped to deal ' + dealGr.getValue('deal_name'));
        } else {
            current.setValue('is_mapped', false);
            current.setValue('mapping_error', 'No deal found with Bigin Deal ID: ' + current.getValue('bigin_deal_id'));
            gs.warn('Commission Management: Invoice mapping failed - deal not found');
        }
    }
}

export function validateInvoiceData(current, previous) {
    // Validate required Bigin Deal ID
    if (!current.getValue('bigin_deal_id')) {
        gs.addErrorMessage('Bigin Deal ID is required for commission calculation');
        current.setAbortAction(true);
        return;
    }
    
    // Check for duplicate Books Invoice IDs
    var gr = new GlideRecord('x_823178_commissio_invoices');
    gr.addQuery('books_invoice_id', current.getValue('books_invoice_id'));
    gr.addQuery('sys_id', '!=', current.sys_id);
    gr.query();
    
    if (gr.next()) {
        gs.addErrorMessage('An invoice with Books Invoice ID ' + current.getValue('books_invoice_id') + ' already exists');
        current.setAbortAction(true);
        return;
    }
}