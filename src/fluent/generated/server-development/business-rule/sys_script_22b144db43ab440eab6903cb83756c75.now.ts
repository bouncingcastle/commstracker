import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['22b144db43ab440eab6903cb83756c75'],
    name: 'Deal Type Validation - Deals',
    table: 'x_823178_commissio_deals',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures deal records use active governed deal types',
    script: Now.include('./sys_script_22b144db43ab440eab6903cb83756c75.server.js'),
})
