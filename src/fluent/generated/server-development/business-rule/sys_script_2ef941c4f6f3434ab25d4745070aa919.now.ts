import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['2ef941c4f6f3434ab25d4745070aa919'],
    name: 'Deal Type Validation - Deals',
    table: 'x_823178_commissio_deals',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures deal records use active governed deal types',
    script: Now.include('./sys_script_2ef941c4f6f3434ab25d4745070aa919.server.js'),
})
