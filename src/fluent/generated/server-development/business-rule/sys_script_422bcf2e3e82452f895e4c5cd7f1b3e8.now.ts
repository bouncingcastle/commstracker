import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['422bcf2e3e82452f895e4c5cd7f1b3e8'],
    name: 'Deal Type Validation - Deals',
    table: 'x_823178_commissio_deals',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures deal records use active governed deal types',
    script: Now.include('./sys_script_422bcf2e3e82452f895e4c5cd7f1b3e8.server.js'),
})
