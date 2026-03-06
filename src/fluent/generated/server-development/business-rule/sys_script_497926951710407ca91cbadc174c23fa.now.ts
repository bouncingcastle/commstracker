import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['497926951710407ca91cbadc174c23fa'],
    name: 'Deal Type Validation - Deals',
    table: 'x_823178_commissio_deals',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures deal records use active governed deal types',
    script: Now.include('./sys_script_497926951710407ca91cbadc174c23fa.server.js'),
})
