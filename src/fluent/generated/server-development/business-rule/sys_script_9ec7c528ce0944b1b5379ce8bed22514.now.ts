import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['9ec7c528ce0944b1b5379ce8bed22514'],
    name: 'Deal Type Validation - Deals',
    table: 'x_823178_commissio_deals',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures deal records use active governed deal types',
    script: Now.include('./sys_script_9ec7c528ce0944b1b5379ce8bed22514.server.js'),
})
