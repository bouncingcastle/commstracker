import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import { snapshotDealOnClose, validateDealMapping, createDealCloseCommissionDraft } from '../../server/business-rules/deal-management.js'

// Business rule to snapshot deal owner when deal is closed won
BusinessRule({
    $id: Now.ID['deal_snapshot'],
    name: 'Deal Snapshot on Close',
    table: 'x_823178_commissio_deals',
    action: ['insert', 'update'],
    when: 'before',
    script: snapshotDealOnClose,
    active: true,
    order: 100,
    description: 'Snapshots the deal owner when a deal is marked as closed won',
})

// Business rule to validate deal data integrity
BusinessRule({
    $id: Now.ID['deal_validation'],
    name: 'Deal Validation',
    table: 'x_823178_commissio_deals',
    action: ['update', 'insert'],
    when: 'before',
    script: validateDealMapping,
    active: true,
    order: 50,
    description: 'Validates deal data integrity and prevents duplicates',
})

// After business rule: creates a pending commission draft when a deal is closed won
BusinessRule({
    $id: Now.ID['deal_close_commission_draft'],
    name: 'Deal Close Commission Draft',
    table: 'x_823178_commissio_deals',
    action: ['update', 'insert'],
    when: 'after',
    script: createDealCloseCommissionDraft,
    active: true,
    order: 200,
    description: 'Creates a draft commission calculation when a deal is marked closed won, allowing pending commissions to appear on the dashboard before payment is received.',
})
