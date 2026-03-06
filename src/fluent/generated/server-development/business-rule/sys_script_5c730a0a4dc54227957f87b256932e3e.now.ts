import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['5c730a0a4dc54227957f87b256932e3e'],
    name: 'Deal Type Validation - Deals',
    table: 'x_823178_commissio_deals',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures deal records use active governed deal types',
    script: Now.include('./sys_script_5c730a0a4dc54227957f87b256932e3e.server.js'),
})
