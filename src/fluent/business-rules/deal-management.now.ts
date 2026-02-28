import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import { snapshotDealOnClose, validateDealMapping } from '../../server/business-rules/deal-management.js'

// Business rule to snapshot deal owner when deal is closed won
BusinessRule({
    $id: Now.ID['deal_snapshot'],
    name: 'Deal Snapshot on Close',
    table: 'x_823178_commissio_deals',
    action: ['update'],
    when: 'before',
    script: snapshotDealOnClose,
    active: true,
    order: 100,
    description: 'Snapshots the deal owner when a deal is marked as closed won'
})

// Business rule to validate deal data integrity
BusinessRule({
    $id: Now.ID['deal_validation'],
    name: 'Deal Validation',
    table: 'x_823178_commissio_deals',
    action: ['insert', 'update'],
    when: 'before',
    script: validateDealMapping,
    active: true,
    order: 50,
    description: 'Validates deal data integrity and prevents duplicates'
})