import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['832393ac6a264367a93f1790bd8e2a60'],
    name: 'Deal Type Validation - Deals',
    table: 'x_823178_commissio_deals',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures deal records use active governed deal types',
    script: Now.include('./sys_script_832393ac6a264367a93f1790bd8e2a60.server.js'),
})
