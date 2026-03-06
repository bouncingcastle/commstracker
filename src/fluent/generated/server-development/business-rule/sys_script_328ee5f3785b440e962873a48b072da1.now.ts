import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['328ee5f3785b440e962873a48b072da1'],
    name: 'Deal Type Validation - Deals',
    table: 'x_823178_commissio_deals',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures deal records use active governed deal types',
    script: Now.include('./sys_script_328ee5f3785b440e962873a48b072da1.server.js'),
})
