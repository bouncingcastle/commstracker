import '@servicenow/sdk/global'
import { RestApi } from '@servicenow/sdk/core'
import { syncDealsFromBigin, syncInvoicesFromBooks, syncPaymentsFromBooks } from '../../server/rest-apis/zoho-integration.js'

RestApi({
    $id: Now.ID['zoho_integration_api'],
    name: 'Zoho Integration API',
    service_id: 'zoho_commission_sync',
    short_description: 'API endpoints for syncing data from Zoho Bigin and Books',
    consumes: 'application/json',
    produces: 'application/json',
    routes: [
        {
            $id: Now.ID['sync_deals_route'],
            name: 'Sync Deals from Bigin',
            path: '/deals/sync',
            method: 'POST',
            script: syncDealsFromBigin,
            short_description: 'Sync deals data from Zoho Bigin',
            authorization: true,
            authentication: true,
            version: 1
        },
        {
            $id: Now.ID['sync_invoices_route'],
            name: 'Sync Invoices from Books',
            path: '/invoices/sync',
            method: 'POST',
            script: syncInvoicesFromBooks,
            short_description: 'Sync invoice data from Zoho Books',
            authorization: true,
            authentication: true,
            version: 1
        },
        {
            $id: Now.ID['sync_payments_route'],
            name: 'Sync Payments from Books',
            path: '/payments/sync',
            method: 'POST',
            script: syncPaymentsFromBooks,
            short_description: 'Sync payment data from Zoho Books',
            authorization: true,
            authentication: true,
            version: 1
        }
    ],
    versions: [
        {
            $id: Now.ID['api_v1'],
            version: 1
        }
    ]
})