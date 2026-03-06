import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['a844006a613a4a52aed1126444e6970d'],
    name: 'Deal Type Validation - Deals',
    table: 'x_823178_commissio_deals',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures deal records use active governed deal types',
    script: Now.include('./sys_script_a844006a613a4a52aed1126444e6970d.server.js'),
})
