import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['b7c72394a12f4f0e9f39bb5e911c19c1'],
    name: 'Deal Type Validation - Deals',
    table: 'x_823178_commissio_deals',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures deal records use active governed deal types',
    script: Now.include('./sys_script_b7c72394a12f4f0e9f39bb5e911c19c1.server.js'),
})
