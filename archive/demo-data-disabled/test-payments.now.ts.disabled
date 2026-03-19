import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Sample Payment for Abel's deal - will trigger commission calculation
Record({
    $id: Now.ID['demo_payment_abel'],
    table: 'x_823178_commissio_payments',
    data: {
        books_payment_id: 'BOOKS_PAY_DEMO_001',
        invoice: '861c6426eff940a8aa2445116e8b2865', // TechCorp invoice
        payment_date: '2024-11-25',
        payment_amount: 75000, // Full payment
        payment_method: 'wire',
        payment_type: 'payment',
        reference_number: 'WIRE-TECHCORP-001',
        commission_calculated: 'pending',
        sync_status: 'synced',
        last_sync: '2024-11-25 10:30:00'
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Sample Payment for Adela's renewal deal - different commission rate
Record({
    $id: Now.ID['demo_payment_adela'],
    table: 'x_823178_commissio_payments',
    data: {
        books_payment_id: 'BOOKS_PAY_DEMO_002',
        invoice: '849da039a3fd49c39e07d44d53e352b3', // GlobalTech invoice
        payment_date: '2024-11-10',
        payment_amount: 120000, // Full payment
        payment_method: 'check',
        payment_type: 'payment',
        reference_number: 'CHECK-GLOBAL-002',
        commission_calculated: 'pending',
        sync_status: 'synced',
        last_sync: '2024-11-10 14:15:00'
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Sample partial refund to test negative commission calculation
Record({
    $id: Now.ID['demo_refund'],
    table: 'x_823178_commissio_payments',
    data: {
        books_payment_id: 'BOOKS_REFUND_001',
        invoice: '861c6426eff940a8aa2445116e8b2865', // TechCorp invoice (refund)
        payment_date: '2024-12-01',
        payment_amount: -5000, // Partial refund
        payment_method: 'wire',
        payment_type: 'refund',
        reference_number: 'REFUND-TECHCORP-001',
        commission_calculated: 'pending',
        sync_status: 'synced',
        last_sync: '2024-12-01 09:00:00'
    },
    $meta: {
        installMethod: 'demo'
    }
})