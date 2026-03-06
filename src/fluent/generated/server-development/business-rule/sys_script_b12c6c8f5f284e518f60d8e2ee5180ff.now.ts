import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['b12c6c8f5f284e518f60d8e2ee5180ff'],
    name: 'Deal Type Validation - Deals',
    table: 'x_823178_commissio_deals',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures deal records use active governed deal types',
    script: Now.include('./sys_script_b12c6c8f5f284e518f60d8e2ee5180ff.server.js'),
})
