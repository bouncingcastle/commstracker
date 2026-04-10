import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import { validateDealClassification } from '../../server/business-rules/deal-classification-validation.js'

BusinessRule({
    $id: 'deal_classification_validation',
    name: 'Deal Classification Validation',
    table: 'x_823178_commissio_deal_classifications',
    action: ['insert', 'update'],
    when: 'before',
    script: validateDealClassification,
    active: true,
    order: 50,
    description: 'Prevents duplicate classifications and enforces single-primary semantics per deal'
})
