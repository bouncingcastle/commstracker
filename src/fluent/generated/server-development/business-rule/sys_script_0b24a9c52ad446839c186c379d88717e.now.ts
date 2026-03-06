import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['0b24a9c52ad446839c186c379d88717e'],
    name: 'Deal Type Validation - Deals',
    table: 'x_823178_commissio_deals',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures deal records use active governed deal types',
    script: Now.include('./sys_script_0b24a9c52ad446839c186c379d88717e.server.js'),
})
