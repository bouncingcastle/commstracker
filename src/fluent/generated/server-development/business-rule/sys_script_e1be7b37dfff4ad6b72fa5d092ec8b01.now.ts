import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['e1be7b37dfff4ad6b72fa5d092ec8b01'],
    name: 'Deal Type Validation - Deals',
    table: 'x_823178_commissio_deals',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures deal records use active governed deal types',
    script: Now.include('./sys_script_e1be7b37dfff4ad6b72fa5d092ec8b01.server.js'),
})
