import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['98a669e1f01c4c8bbaec7161c14b4400'],
    name: 'Deal Classification Validation',
    table: 'x_823178_commissio_deal_classifications',
    order: 50,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Prevents duplicate classifications and enforces single-primary semantics per deal',
    script: Now.include('./sys_script_98a669e1f01c4c8bbaec7161c14b4400.server.js'),
})
