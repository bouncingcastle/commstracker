import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['5359e7be8e9740809d4292f13be98fad'],
    name: 'Deal Type Validation - Deals',
    table: 'x_823178_commissio_deals',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures deal records use active governed deal types',
    script: Now.include('./sys_script_5359e7be8e9740809d4292f13be98fad.server.js'),
})
