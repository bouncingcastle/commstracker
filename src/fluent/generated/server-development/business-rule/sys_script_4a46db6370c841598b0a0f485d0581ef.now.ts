import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['4a46db6370c841598b0a0f485d0581ef'],
    name: 'Deal Classification Validation',
    table: 'x_823178_commissio_deal_classifications',
    order: 50,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Prevents duplicate classifications and enforces single-primary semantics per deal',
    script: Now.include('./sys_script_4a46db6370c841598b0a0f485d0581ef.server.js'),
})
