import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['f8e43529cfd2488b8bf0476ab7ce5d13'],
    name: 'Deal Type Validation - Deals',
    table: 'x_823178_commissio_deals',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures deal records use active governed deal types',
    script: Now.include('./sys_script_f8e43529cfd2488b8bf0476ab7ce5d13.server.js'),
})
