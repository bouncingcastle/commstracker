import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['34029c6f5eef4f7abf4ee0b398228fa8'],
    name: 'Deal Classification Validation',
    table: 'x_823178_commissio_deal_classifications',
    order: 50,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Prevents duplicate classifications and enforces single-primary semantics per deal',
    script: Now.include('./sys_script_34029c6f5eef4f7abf4ee0b398228fa8.server.js'),
})
