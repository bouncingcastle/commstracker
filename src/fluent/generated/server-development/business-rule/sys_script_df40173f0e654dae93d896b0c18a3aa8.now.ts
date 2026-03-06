import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['df40173f0e654dae93d896b0c18a3aa8'],
    name: 'Deal Type Validation - Deals',
    table: 'x_823178_commissio_deals',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures deal records use active governed deal types',
    script: Now.include('./sys_script_df40173f0e654dae93d896b0c18a3aa8.server.js'),
})
