import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Commission Plans for our demo users

// Abel Tuter - Standard Rep Plan
Record({
    $id: Now.ID['abel_plan_2024'],
    table: 'x_823178_commissio_commission_plans',
    data: {
        plan_name: 'Abel Tuter - Standard Plan 2024',
        sales_rep: '62826bf03710200044e0bfc8bcbe5df1', // Abel Tuter
        effective_start_date: '2024-01-01',
        effective_end_date: '2024-12-31',
        is_active: true,
        new_business_rate: 8.0,
        renewal_rate: 3.0,
        expansion_rate: 6.0,
        upsell_rate: 5.0,
        base_rate: 5.0,
        description: 'Standard commission plan for Abel Tuter - 8% new business, 3% renewals'
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Adela Cervantsz - Senior Rep Plan (higher rates)
Record({
    $id: Now.ID['adela_plan_2024'],
    table: 'x_823178_commissio_commission_plans',
    data: {
        plan_name: 'Adela Cervantsz - Senior Rep Plan 2024',
        sales_rep: '0a826bf03710200044e0bfc8bcbe5d7a', // Adela Cervantsz
        effective_start_date: '2024-01-01',
        effective_end_date: '2024-12-31',
        is_active: true,
        new_business_rate: 10.0,
        renewal_rate: 4.0,
        expansion_rate: 8.0,
        upsell_rate: 7.0,
        base_rate: 6.0,
        description: 'Senior commission plan for Adela Cervantsz - 10% new business, 4% renewals'
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Abraham Lincoln - Admin/Test Plan
Record({
    $id: Now.ID['abraham_plan_2024'],
    table: 'x_823178_commissio_commission_plans',
    data: {
        plan_name: 'Abraham Lincoln - Admin Test Plan 2024',
        sales_rep: 'a8f98bb0eb32010045e1a5115206fe3a', // Abraham Lincoln
        effective_start_date: '2024-01-01',
        effective_end_date: '2024-12-31',
        is_active: true,
        new_business_rate: 5.0,
        renewal_rate: 2.0,
        expansion_rate: 4.0,
        upsell_rate: 3.0,
        base_rate: 3.0,
        description: 'Test commission plan for system administration and testing'
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Enhanced sample deal with proper owner
Record({
    $id: Now.ID['demo_deal_closed'],
    table: 'x_823178_commissio_deals',
    data: {
        bigin_deal_id: 'BIGIN_DEMO_001',
        deal_name: 'TechCorp Enterprise License',
        account_name: 'TechCorp Solutions',
        current_owner: '62826bf03710200044e0bfc8bcbe5df1', // Abel Tuter
        owner_at_close: '62826bf03710200044e0bfc8bcbe5df1', // Abel Tuter
        amount: 75000,
        close_date: '2024-11-15',
        stage: 'closed_won',
        deal_type: 'new_business',
        is_won: true,
        snapshot_taken: true,
        sync_status: 'synced',
        last_sync: '2024-11-15 14:30:00'
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Enhanced sample invoice linked to deal
Record({
    $id: Now.ID['demo_invoice_001'],
    table: 'x_823178_commissio_invoices',
    data: {
        books_invoice_id: 'BOOKS_INV_DEMO_001',
        bigin_deal_id: 'BIGIN_DEMO_001',
        invoice_number: 'INV-2024-11-001',
        customer_name: 'TechCorp Solutions',
        invoice_date: '2024-11-20',
        subtotal: 70000, // Commission base
        tax_amount: 5000,
        total_amount: 75000,
        status: 'paid',
        is_mapped: true,
        sync_status: 'synced',
        last_sync: '2024-11-20 09:15:00'
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Another deal for Adela (senior rep) 
Record({
    $id: Now.ID['demo_deal_adela'],
    table: 'x_823178_commissio_deals',
    data: {
        bigin_deal_id: 'BIGIN_DEMO_002',
        deal_name: 'GlobalTech Renewal Contract',
        account_name: 'GlobalTech Industries',
        current_owner: '0a826bf03710200044e0bfc8bcbe5d7a', // Adela Cervantsz
        owner_at_close: '0a826bf03710200044e0bfc8bcbe5d7a', // Adela Cervantsz
        amount: 120000,
        close_date: '2024-10-30',
        stage: 'closed_won',
        deal_type: 'renewal',
        is_won: true,
        snapshot_taken: true,
        sync_status: 'synced',
        last_sync: '2024-10-30 16:45:00'
    },
    $meta: {
        installMethod: 'demo'
    }
})

Record({
    $id: Now.ID['demo_invoice_002'],
    table: 'x_823178_commissio_invoices',
    data: {
        books_invoice_id: 'BOOKS_INV_DEMO_002',
        bigin_deal_id: 'BIGIN_DEMO_002',
        invoice_number: 'INV-2024-10-002',
        customer_name: 'GlobalTech Industries',
        invoice_date: '2024-11-01',
        subtotal: 110000, // Commission base
        tax_amount: 10000,
        total_amount: 120000,
        status: 'paid',
        is_mapped: true,
        sync_status: 'synced',
        last_sync: '2024-11-01 11:20:00'
    },
    $meta: {
        installMethod: 'demo'
    }
})