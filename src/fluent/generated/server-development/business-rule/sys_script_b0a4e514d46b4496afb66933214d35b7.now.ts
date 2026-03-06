import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['b0a4e514d46b4496afb66933214d35b7'],
    name: 'Deal Type Validation - Deals',
    table: 'x_823178_commissio_deals',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures deal records use active governed deal types',
    script: Now.include('./sys_script_b0a4e514d46b4496afb66933214d35b7.server.js'),
})
