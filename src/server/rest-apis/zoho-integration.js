import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide/sn_ws_int'

export function syncDealsFromBigin(request, response) {
    try {
        var requestBody = request.body;
        var dealsData = requestBody.data;
        
        if (!dealsData || !Array.isArray(dealsData)) {
            response.setStatus(400);
            response.setBody({ error: 'Invalid request: deals data array is required' });
            return;
        }
        
        var results = {
            success: 0,
            errors: 0,
            details: []
        };
        
        for (var i = 0; i < dealsData.length; i++) {
            var dealData = dealsData[i];
            
            try {
                // Check if deal already exists
                var dealGr = new GlideRecord('x_823178_commissio_deals');
                dealGr.addQuery('bigin_deal_id', dealData.bigin_deal_id);
                dealGr.query();
                
                if (dealGr.next()) {
                    // Update existing deal
                    updateDealFromBigin(dealGr, dealData);
                } else {
                    // Create new deal
                    dealGr.initialize();
                    updateDealFromBigin(dealGr, dealData);
                }
                
                dealGr.setValue('last_sync', new GlideDateTime().getDisplayValue());
                dealGr.setValue('sync_status', 'synced');
                
                if (dealGr.insert() || dealGr.update()) {
                    results.success++;
                    results.details.push({
                        bigin_deal_id: dealData.bigin_deal_id,
                        status: 'success'
                    });
                } else {
                    results.errors++;
                    results.details.push({
                        bigin_deal_id: dealData.bigin_deal_id,
                        status: 'error',
                        message: 'Failed to save deal'
                    });
                }
                
            } catch (e) {
                results.errors++;
                results.details.push({
                    bigin_deal_id: dealData.bigin_deal_id || 'unknown',
                    status: 'error',
                    message: e.message
                });
            }
        }
        
        response.setStatus(200);
        response.setBody(results);
        
    } catch (e) {
        gs.error('Commission Management: Error syncing deals - ' + e.message);
        response.setStatus(500);
        response.setBody({ error: 'Internal server error: ' + e.message });
    }
}

function updateDealFromBigin(dealGr, dealData) {
    var dealTypeRef = resolveDealTypeRefFromCode(dealData.deal_type || 'new_business');
    if (!dealTypeRef) {
        throw new Error('Deal type could not be resolved to an active Deal Type reference for code: ' + (dealData.deal_type || 'new_business'));
    }

    dealGr.setValue('bigin_deal_id', dealData.bigin_deal_id);
    dealGr.setValue('deal_name', dealData.deal_name || '');
    dealGr.setValue('account_name', dealData.account_name || '');
    dealGr.setValue('amount', dealData.amount || 0);
    dealGr.setValue('close_date', normalizeDateValue(dealData.close_date));
    dealGr.setValue('stage', dealData.stage || 'lead');
    dealGr.setValue('deal_type_ref', dealTypeRef);
    
    // Map owner by email if provided
    if (dealData.owner_email) {
        var userGr = new GlideRecord('sys_user');
        userGr.addQuery('email', dealData.owner_email);
        userGr.query();
        if (userGr.next()) {
            dealGr.setValue('current_owner', userGr.sys_id);
        }
    }
}

export function syncInvoicesFromBooks(request, response) {
    try {
        var requestBody = request.body;
        var invoicesData = requestBody.data;
        
        if (!invoicesData || !Array.isArray(invoicesData)) {
            response.setStatus(400);
            response.setBody({ error: 'Invalid request: invoices data array is required' });
            return;
        }
        
        var results = {
            success: 0,
            errors: 0,
            details: []
        };
        
        for (var i = 0; i < invoicesData.length; i++) {
            var invoiceData = invoicesData[i];
            
            try {
                // Check if invoice already exists
                var invoiceGr = new GlideRecord('x_823178_commissio_invoices');
                invoiceGr.addQuery('books_invoice_id', invoiceData.books_invoice_id);
                invoiceGr.query();
                
                if (invoiceGr.next()) {
                    // Update existing invoice
                    updateInvoiceFromBooks(invoiceGr, invoiceData);
                } else {
                    // Create new invoice
                    invoiceGr.initialize();
                    updateInvoiceFromBooks(invoiceGr, invoiceData);
                }
                
                invoiceGr.setValue('last_sync', new GlideDateTime().getDisplayValue());
                invoiceGr.setValue('sync_status', 'synced');
                
                if (invoiceGr.insert() || invoiceGr.update()) {
                    results.success++;
                    results.details.push({
                        books_invoice_id: invoiceData.books_invoice_id,
                        status: 'success'
                    });
                } else {
                    results.errors++;
                    results.details.push({
                        books_invoice_id: invoiceData.books_invoice_id,
                        status: 'error',
                        message: 'Failed to save invoice'
                    });
                }
                
            } catch (e) {
                results.errors++;
                results.details.push({
                    books_invoice_id: invoiceData.books_invoice_id || 'unknown',
                    status: 'error',
                    message: e.message
                });
            }
        }
        
        response.setStatus(200);
        response.setBody(results);
        
    } catch (e) {
        gs.error('Commission Management: Error syncing invoices - ' + e.message);
        response.setStatus(500);
        response.setBody({ error: 'Internal server error: ' + e.message });
    }
}

function updateInvoiceFromBooks(invoiceGr, invoiceData) {
    invoiceGr.setValue('books_invoice_id', invoiceData.books_invoice_id);
    invoiceGr.setValue('bigin_deal_id', invoiceData.bigin_deal_id || '');
    invoiceGr.setValue('invoice_number', invoiceData.invoice_number || '');
    invoiceGr.setValue('customer_name', invoiceData.customer_name || '');
    invoiceGr.setValue('invoice_date', normalizeDateValue(invoiceData.invoice_date));
    invoiceGr.setValue('subtotal', invoiceData.subtotal || 0);
    invoiceGr.setValue('tax_amount', invoiceData.tax_amount || 0);
    invoiceGr.setValue('total_amount', invoiceData.total_amount || 0);
    invoiceGr.setValue('status', invoiceData.status || 'draft');
}

export function syncPaymentsFromBooks(request, response) {
    try {
        var requestBody = request.body;
        var paymentsData = requestBody.data;
        
        if (!paymentsData || !Array.isArray(paymentsData)) {
            response.setStatus(400);
            response.setBody({ error: 'Invalid request: payments data array is required' });
            return;
        }
        
        var results = {
            success: 0,
            errors: 0,
            details: []
        };
        
        for (var i = 0; i < paymentsData.length; i++) {
            var paymentData = paymentsData[i];
            
            try {
                // Check if payment already exists
                var paymentGr = new GlideRecord('x_823178_commissio_payments');
                paymentGr.addQuery('books_payment_id', paymentData.books_payment_id);
                paymentGr.query();
                
                if (paymentGr.next()) {
                    // Update existing payment
                    updatePaymentFromBooks(paymentGr, paymentData);
                } else {
                    // Create new payment
                    paymentGr.initialize();
                    updatePaymentFromBooks(paymentGr, paymentData);
                }
                
                paymentGr.setValue('last_sync', new GlideDateTime().getDisplayValue());
                paymentGr.setValue('sync_status', 'synced');
                
                if (paymentGr.insert() || paymentGr.update()) {
                    results.success++;
                    results.details.push({
                        books_payment_id: paymentData.books_payment_id,
                        status: 'success'
                    });
                } else {
                    results.errors++;
                    results.details.push({
                        books_payment_id: paymentData.books_payment_id,
                        status: 'error',
                        message: 'Failed to save payment'
                    });
                }
                
            } catch (e) {
                results.errors++;
                results.details.push({
                    books_payment_id: paymentData.books_payment_id || 'unknown',
                    status: 'error',
                    message: e.message
                });
            }
        }
        
        response.setStatus(200);
        response.setBody(results);
        
    } catch (e) {
        gs.error('Commission Management: Error syncing payments - ' + e.message);
        response.setStatus(500);
        response.setBody({ error: 'Internal server error: ' + e.message });
    }
}

function updatePaymentFromBooks(paymentGr, paymentData) {
    paymentGr.setValue('books_payment_id', paymentData.books_payment_id);
    paymentGr.setValue('payment_date', normalizeDateValue(paymentData.payment_date));
    paymentGr.setValue('payment_amount', paymentData.payment_amount || 0);
    paymentGr.setValue('payment_method', paymentData.payment_method || 'other');
    paymentGr.setValue('payment_type', paymentData.payment_type || 'payment');
    paymentGr.setValue('reference_number', paymentData.reference_number || '');
    
    // Find and link invoice
    if (paymentData.books_invoice_id) {
        var invoiceGr = new GlideRecord('x_823178_commissio_invoices');
        invoiceGr.addQuery('books_invoice_id', paymentData.books_invoice_id);
        invoiceGr.query();
        if (invoiceGr.next()) {
            paymentGr.setValue('invoice', invoiceGr.sys_id);
            if (invoiceGr.getValue('deal')) {
                paymentGr.setValue('deal', invoiceGr.getValue('deal'));
            }
        }
    }
}

function normalizeDateValue(value) {
    if (!value) {
        return '';
    }

    var raw = (value + '').trim();
    if (!raw) {
        return '';
    }

    if (raw.length >= 10) {
        return raw.substring(0, 10);
    }

    return raw;
}

function resolveDealTypeRefFromCode(code) {
    var normalized = normalizeDealTypeCode(code || 'new_business');
    var typeGr = new GlideRecord('x_823178_commissio_deal_types');
    typeGr.addQuery('code', normalized);
    typeGr.addQuery('is_active', true);
    typeGr.setLimit(1);
    typeGr.query();
    if (typeGr.next()) {
        return typeGr.getUniqueValue();
    }
    return '';
}

function normalizeDealTypeCode(value) {
    var normalized = (value || '').toString().trim().toLowerCase();
    if (!normalized) return 'new_business';
    if (normalized === 'new business') return 'new_business';
    if (normalized === 'existing_business') return 'renewal';
    return normalized.replace(/[^a-z0-9_]/g, '_');
}