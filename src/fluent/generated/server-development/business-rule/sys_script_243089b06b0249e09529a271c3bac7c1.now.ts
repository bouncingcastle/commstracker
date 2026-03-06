import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['243089b06b0249e09529a271c3bac7c1'],
    name: 'Deal Type Validation - Deals',
    table: 'x_823178_commissio_deals',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures deal records use active governed deal types',
    script: Now.include('./sys_script_243089b06b0249e09529a271c3bac7c1.server.js'),
})
