import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['b232688a582044c6a2d5c29cccd2ca63'],
    name: 'Deal Type Validation - Deals',
    table: 'x_823178_commissio_deals',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures deal records use active governed deal types',
    script: Now.include('./sys_script_b232688a582044c6a2d5c29cccd2ca63.server.js'),
})
