import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['c82a4be9a8134895beefe3401a21601e'],
    name: 'Deal Type Validation - Deals',
    table: 'x_823178_commissio_deals',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures deal records use active governed deal types',
    script: Now.include('./sys_script_c82a4be9a8134895beefe3401a21601e.server.js'),
})
