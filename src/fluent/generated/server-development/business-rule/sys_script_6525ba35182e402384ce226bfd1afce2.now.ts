import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['6525ba35182e402384ce226bfd1afce2'],
    name: 'Deal Type Validation - Deals',
    table: 'x_823178_commissio_deals',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures deal records use active governed deal types',
    script: Now.include('./sys_script_6525ba35182e402384ce226bfd1afce2.server.js'),
})
