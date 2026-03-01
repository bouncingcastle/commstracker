import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import { enforceDealTypeLifecycleGovernance } from '../../server/business-rules/deal-type-governance.js'

BusinessRule({
    $id: 'deal_type_governance_validation',
    name: 'Deal Type Governance Validation',
    table: 'x_823178_commissio_deal_types',
    action: ['insert', 'update'],
    when: 'before',
    script: enforceDealTypeLifecycleGovernance,
    active: true,
    order: 40,
    description: 'Enforces deal type lifecycle controls, impact checks, and override requirements for deactivation'
})
