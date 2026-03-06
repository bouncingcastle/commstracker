import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['47374b3f31a548c78a72245cc807382e'],
    name: 'Deal Type Validation - Deals',
    table: 'x_823178_commissio_deals',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures deal records use active governed deal types',
    script: Now.include('./sys_script_47374b3f31a548c78a72245cc807382e.server.js'),
})
