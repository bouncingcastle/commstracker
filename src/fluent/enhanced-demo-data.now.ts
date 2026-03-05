import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Commission Plans for our demo users

// Abel Tuter - Standard Rep Plan (2026)
Record({
    $id: Now.ID['abel_plan_2026'],
    table: 'x_823178_commissio_commission_plans',
    data: {
        plan_name: 'Abel Tuter - Standard Plan 2026',
        sales_rep: '62826bf03710200044e0bfc8bcbe5df1', // Abel Tuter
        effective_start_date: '2026-01-01',
        effective_end_date: '2026-12-31',
        is_active: true,
        lifecycle_state: 'active',
        plan_version: 1,
        plan_target_amount: 50000,
        new_business_rate: 8.0,
        renewal_rate: 3.0,
        expansion_rate: 6.0,
        upsell_rate: 5.0,
        base_rate: 5.0,
        description: 'Standard commission plan for Abel Tuter - 8% new business, 3% renewals - $50K target'
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Adela Cervantsz - Senior Rep Plan (2026, higher rates and target)
Record({
    $id: Now.ID['adela_plan_2026'],
    table: 'x_823178_commissio_commission_plans',
    data: {
        plan_name: 'Adela Cervantsz - Senior Rep Plan 2026',
        sales_rep: '0a826bf03710200044e0bfc8bcbe5d7a', // Adela Cervantsz
        effective_start_date: '2026-01-01',
        effective_end_date: '2026-12-31',
        is_active: true,
        lifecycle_state: 'active',
        plan_version: 1,
        plan_target_amount: 85000,
        new_business_rate: 10.0,
        renewal_rate: 4.0,
        expansion_rate: 8.0,
        upsell_rate: 7.0,
        base_rate: 6.0,
        description: 'Senior commission plan for Adela Cervantsz - 10% new business, 4% renewals - $85K target'
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Abraham Lincoln - Admin/Test Plan (2026)
Record({
    $id: Now.ID['abraham_plan_2026'],
    table: 'x_823178_commissio_commission_plans',
    data: {
        plan_name: 'Abraham Lincoln - Admin Test Plan 2026',
        sales_rep: 'a8f98bb0eb32010045e1a5115206fe3a', // Abraham Lincoln
        effective_start_date: '2026-01-01',
        effective_end_date: '2026-12-31',
        is_active: true,
        lifecycle_state: 'active',
        plan_version: 1,
        plan_target_amount: 35000,
        new_business_rate: 5.0,
        renewal_rate: 2.0,
        expansion_rate: 4.0,
        upsell_rate: 3.0,
        base_rate: 3.0,
        description: 'Test commission plan for system administration and testing - $35K target'
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Deal 1: Abel Tuter - New Business (Jan 2026)
Record({
    $id: Now.ID['demo_deal_abel_1'],
    table: 'x_823178_commissio_deals',
    data: {
        bigin_deal_id: 'BIGIN_DEMO_2026_001',
        deal_name: 'CloudTech Enterprise License',
        account_name: 'CloudTech Solutions',
        current_owner: '62826bf03710200044e0bfc8bcbe5df1', // Abel Tuter
        owner_at_close: '62826bf03710200044e0bfc8bcbe5df1',
        amount: 60000,
        close_date: '2026-01-20',
        stage: 'closed_won',
        deal_type: 'new_business',
        is_won: true,
        snapshot_taken: true,
        sync_status: 'synced',
        last_sync: '2026-01-20 14:30:00'
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Invoice 1: Abel's Deal
Record({
    $id: Now.ID['demo_invoice_abel_1'],
    table: 'x_823178_commissio_invoices',
    data: {
        books_invoice_id: 'BOOKS_INV_2026_001',
        bigin_deal_id: 'BIGIN_DEMO_2026_001',
        invoice_number: 'INV-2026-01-001',
        customer_name: 'CloudTech Solutions',
        invoice_date: '2026-01-21',
        subtotal: 55000,
        tax_amount: 5000,
        total_amount: 60000,
        status: 'paid',
        is_mapped: true,
        sync_status: 'synced',
        last_sync: '2026-01-21 09:15:00'
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Payment 1: Abel's Invoice
Record({
    $id: Now.ID['demo_payment_abel_1'],
    table: 'x_823178_commissio_payments',
    data: {
        books_payment_id: 'PAY_2026_001',
        invoice: Now.ID['demo_invoice_abel_1'],
        deal: Now.ID['demo_deal_abel_1'],
        payment_date: '2026-02-01',
        payment_amount: 60000,
        payment_method: 'ach',
        received_date: '2026-02-01',
        status: 'received',
        sync_status: 'synced'
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Commission Calculation 1: Abel's Deal (8% new business rate on $55K base)
Record({
    $id: Now.ID['demo_calc_abel_1'],
    table: 'x_823178_commissio_commission_calculations',
    data: {
        sales_rep: '62826bf03710200044e0bfc8bcbe5df1', // Abel Tuter
        payment: Now.ID['demo_payment_abel_1'],
        deal: Now.ID['demo_deal_abel_1'],
        invoice: Now.ID['demo_invoice_abel_1'],
        commission_plan: Now.ID['abel_plan_2026'],
        commission_base_amount: 55000,
        commission_rate: 8.0,
        commission_amount: 4400,
        payment_date: '2026-02-01',
        deal_close_date: '2026-01-20',
        calculation_date: '2026-02-01 10:00:00',
        deal_type: 'new_business',
        is_negative: false,
        status: 'draft',
        requires_approval: false
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Deal 2: Abel Tuter - Another New Business (Feb 2026)
Record({
    $id: Now.ID['demo_deal_abel_2'],
    table: 'x_823178_commissio_deals',
    data: {
        bigin_deal_id: 'BIGIN_DEMO_2026_002',
        deal_name: 'DataVault Expansion',
        account_name: 'DataVault Inc',
        current_owner: '62826bf03710200044e0bfc8bcbe5df1', // Abel Tuter
        owner_at_close: '62826bf03710200044e0bfc8bcbe5df1',
        amount: 35000,
        close_date: '2026-02-10',
        stage: 'closed_won',
        deal_type: 'expansion',
        is_won: true,
        snapshot_taken: true,
        sync_status: 'synced'
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Invoice 2: Abel's Expansion Deal
Record({
    $id: Now.ID['demo_invoice_abel_2'],
    table: 'x_823178_commissio_invoices',
    data: {
        books_invoice_id: 'BOOKS_INV_2026_002',
        bigin_deal_id: 'BIGIN_DEMO_2026_002',
        invoice_number: 'INV-2026-02-002',
        customer_name: 'DataVault Inc',
        invoice_date: '2026-02-11',
        subtotal: 32000,
        tax_amount: 3000,
        total_amount: 35000,
        status: 'paid',
        is_mapped: true,
        sync_status: 'synced'
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Payment 2: Abel's Expansion Invoice
Record({
    $id: Now.ID['demo_payment_abel_2'],
    table: 'x_823178_commissio_payments',
    data: {
        books_payment_id: 'PAY_2026_002',
        invoice: Now.ID['demo_invoice_abel_2'],
        deal: Now.ID['demo_deal_abel_2'],
        payment_date: '2026-02-15',
        payment_amount: 35000,
        payment_method: 'ach',
        received_date: '2026-02-15',
        status: 'received',
        sync_status: 'synced'
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Commission Calculation 2: Abel's Expansion (6% expansion rate on $32K base)
Record({
    $id: Now.ID['demo_calc_abel_2'],
    table: 'x_823178_commissio_commission_calculations',
    data: {
        sales_rep: '62826bf03710200044e0bfc8bcbe5df1', // Abel Tuter
        payment: Now.ID['demo_payment_abel_2'],
        deal: Now.ID['demo_deal_abel_2'],
        invoice: Now.ID['demo_invoice_abel_2'],
        commission_plan: Now.ID['abel_plan_2026'],
        commission_base_amount: 32000,
        commission_rate: 6.0,
        commission_amount: 1920,
        payment_date: '2026-02-15',
        deal_close_date: '2026-02-10',
        calculation_date: '2026-02-15 11:00:00',
        deal_type: 'expansion',
        is_negative: false,
        status: 'draft',
        requires_approval: false
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Deal 3: Adela Cervantsz - Renewal (Jan 2026)
Record({
    $id: Now.ID['demo_deal_adela_1'],
    table: 'x_823178_commissio_deals',
    data: {
        bigin_deal_id: 'BIGIN_DEMO_2026_003',
        deal_name: 'GlobalTech Annual Renewal',
        account_name: 'GlobalTech Industries',
        current_owner: '0a826bf03710200044e0bfc8bcbe5d7a', // Adela Cervantsz
        owner_at_close: '0a826bf03710200044e0bfc8bcbe5d7a',
        amount: 150000,
        close_date: '2026-01-15',
        stage: 'closed_won',
        deal_type: 'renewal',
        is_won: true,
        snapshot_taken: true,
        sync_status: 'synced'
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Invoice 3: Adela's Renewal Deal
Record({
    $id: Now.ID['demo_invoice_adela_1'],
    table: 'x_823178_commissio_invoices',
    data: {
        books_invoice_id: 'BOOKS_INV_2026_003',
        bigin_deal_id: 'BIGIN_DEMO_2026_003',
        invoice_number: 'INV-2026-01-003',
        customer_name: 'GlobalTech Industries',
        invoice_date: '2026-01-16',
        subtotal: 142000,
        tax_amount: 8000,
        total_amount: 150000,
        status: 'paid',
        is_mapped: true,
        sync_status: 'synced'
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Payment 3: Adela's Renewal Invoice
Record({
    $id: Now.ID['demo_payment_adela_1'],
    table: 'x_823178_commissio_payments',
    data: {
        books_payment_id: 'PAY_2026_003',
        invoice: Now.ID['demo_invoice_adela_1'],
        deal: Now.ID['demo_deal_adela_1'],
        payment_date: '2026-01-25',
        payment_amount: 150000,
        payment_method: 'ach',
        received_date: '2026-01-25',
        status: 'received',
        sync_status: 'synced'
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Commission Calculation 3: Adela's Renewal (4% renewal rate on $142K base)
Record({
    $id: Now.ID['demo_calc_adela_1'],
    table: 'x_823178_commissio_commission_calculations',
    data: {
        sales_rep: '0a826bf03710200044e0bfc8bcbe5d7a', // Adela Cervantsz
        payment: Now.ID['demo_payment_adela_1'],
        deal: Now.ID['demo_deal_adela_1'],
        invoice: Now.ID['demo_invoice_adela_1'],
        commission_plan: Now.ID['adela_plan_2026'],
        commission_base_amount: 142000,
        commission_rate: 4.0,
        commission_amount: 5680,
        payment_date: '2026-01-25',
        deal_close_date: '2026-01-15',
        calculation_date: '2026-01-25 14:00:00',
        deal_type: 'renewal',
        is_negative: false,
        status: 'draft',
        requires_approval: false
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Deal 4: Adela Cervantsz - New Business (Feb 2026)
Record({
    $id: Now.ID['demo_deal_adela_2'],
    table: 'x_823178_commissio_deals',
    data: {
        bigin_deal_id: 'BIGIN_DEMO_2026_004',
        deal_name: 'SecureNet Professional Services',
        account_name: 'SecureNet Inc',
        current_owner: '0a826bf03710200044e0bfc8bcbe5d7a', // Adela Cervantsz
        owner_at_close: '0a826bf03710200044e0bfc8bcbe5d7a',
        amount: 95000,
        close_date: '2026-02-05',
        stage: 'closed_won',
        deal_type: 'new_business',
        is_won: true,
        snapshot_taken: true,
        sync_status: 'synced'
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Invoice 4: Adela's New Business Deal
Record({
    $id: Now.ID['demo_invoice_adela_2'],
    table: 'x_823178_commissio_invoices',
    data: {
        books_invoice_id: 'BOOKS_INV_2026_004',
        bigin_deal_id: 'BIGIN_DEMO_2026_004',
        invoice_number: 'INV-2026-02-004',
        customer_name: 'SecureNet Inc',
        invoice_date: '2026-02-06',
        subtotal: 88000,
        tax_amount: 7000,
        total_amount: 95000,
        status: 'paid',
        is_mapped: true,
        sync_status: 'synced'
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Payment 4: Adela's New Business Invoice
Record({
    $id: Now.ID['demo_payment_adela_2'],
    table: 'x_823178_commissio_payments',
    data: {
        books_payment_id: 'PAY_2026_004',
        invoice: Now.ID['demo_invoice_adela_2'],
        deal: Now.ID['demo_deal_adela_2'],
        payment_date: '2026-02-20',
        payment_amount: 95000,
        payment_method: 'ach',
        received_date: '2026-02-20',
        status: 'received',
        sync_status: 'synced'
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Commission Calculation 4: Adela's New Business (10% new business rate on $88K base)
Record({
    $id: Now.ID['demo_calc_adela_2'],
    table: 'x_823178_commissio_commission_calculations',
    data: {
        sales_rep: '0a826bf03710200044e0bfc8bcbe5d7a', // Adela Cervantsz
        payment: Now.ID['demo_payment_adela_2'],
        deal: Now.ID['demo_deal_adela_2'],
        invoice: Now.ID['demo_invoice_adela_2'],
        commission_plan: Now.ID['adela_plan_2026'],
        commission_base_amount: 88000,
        commission_rate: 10.0,
        commission_amount: 8800,
        payment_date: '2026-02-20',
        deal_close_date: '2026-02-05',
        calculation_date: '2026-02-20 09:30:00',
        deal_type: 'new_business',
        is_negative: false,
        status: 'draft',
        requires_approval: false
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Active Deal: Abel Tuter - Pipeline
Record({
    $id: Now.ID['demo_deal_abel_active_1'],
    table: 'x_823178_commissio_deals',
    data: {
        bigin_deal_id: 'BIGIN_DEMO_2026_ACTIVE_1',
        deal_name: 'InnovateTech Implementation',
        account_name: 'InnovateTech Corp',
        current_owner: '62826bf03710200044e0bfc8bcbe5df1', // Abel Tuter
        amount: 120000,
        close_date: '2026-04-30',
        stage: 'proposal',
        deal_type: 'new_business',
        is_won: false,
        snapshot_taken: false,
        sync_status: 'synced'
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Active Deal: Adela Cervantsz - Pipeline
Record({
    $id: Now.ID['demo_deal_adela_active_1'],
    table: 'x_823178_commissio_deals',
    data: {
        bigin_deal_id: 'BIGIN_DEMO_2026_ACTIVE_2',
        deal_name: 'TechGlobal Expansion Package',
        account_name: 'TechGlobal Corporation',
        current_owner: '0a826bf03710200044e0bfc8bcbe5d7a', // Adela Cervantsz
        amount: 250000,
        close_date: '2026-05-15',
        stage: 'negotiation',
        deal_type: 'expansion',
        is_won: false,
        snapshot_taken: false,
        sync_status: 'synced'
    },
    $meta: {
        installMethod: 'demo'
    }
})
