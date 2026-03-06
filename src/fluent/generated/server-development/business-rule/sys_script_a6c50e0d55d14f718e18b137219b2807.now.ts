import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['a6c50e0d55d14f718e18b137219b2807'],
    name: 'Deal Type Validation - Deals',
    table: 'x_823178_commissio_deals',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures deal records use active governed deal types',
    script: Now.include('./sys_script_a6c50e0d55d14f718e18b137219b2807.server.js'),
})
