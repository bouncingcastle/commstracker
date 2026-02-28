import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Sample Commission Plans
Record({
    $id: Now.ID['sample_plan_1'],
    table: 'x_823178_commissio_commission_plans',
    data: {
        plan_name: 'Standard Sales Rep Plan 2024',
        sales_rep: '62826bf03710200044e0bfc8bcbe5df1', // Abel Tuter
        effective_start_date: '2024-01-01',
        is_active: true,
        new_business_rate: 8.0,
        renewal_rate: 3.0,
        expansion_rate: 6.0,
        upsell_rate: 5.0,
        base_rate: 5.0,
        description: 'Standard commission plan for Abel Tuter in 2024'
    },
    $meta: {
        installMethod: 'demo'
    }
})

Record({
    $id: Now.ID['sample_plan_2'],
    table: 'x_823178_commissio_commission_plans',
    data: {
        plan_name: 'Senior Sales Rep Plan 2024',
        sales_rep: '0a826bf03710200044e0bfc8bcbe5d7a', // Adela Cervantsz
        effective_start_date: '2024-01-01',
        is_active: true,
        new_business_rate: 10.0,
        renewal_rate: 4.0,
        expansion_rate: 8.0,
        upsell_rate: 7.0,
        base_rate: 6.0,
        description: 'Premium commission plan for senior sales representatives'
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Sample Deal
Record({
    $id: Now.ID['sample_deal_1'],
    table: 'x_823178_commissio_deals',
    data: {
        bigin_deal_id: 'BIGIN_12345',
        deal_name: 'Acme Corp Software License',
        account_name: 'Acme Corporation',
        current_owner: '62826bf03710200044e0bfc8bcbe5df1', // Abel Tuter
        owner_at_close: '62826bf03710200044e0bfc8bcbe5df1', // Abel Tuter
        amount: 50000,
        close_date: '2024-06-15',
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