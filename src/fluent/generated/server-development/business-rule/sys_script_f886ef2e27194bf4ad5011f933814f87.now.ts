import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['f886ef2e27194bf4ad5011f933814f87'],
    name: 'Deal Type Validation - Deals',
    table: 'x_823178_commissio_deals',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures deal records use active governed deal types',
    script: Now.include('./sys_script_f886ef2e27194bf4ad5011f933814f87.server.js'),
})
