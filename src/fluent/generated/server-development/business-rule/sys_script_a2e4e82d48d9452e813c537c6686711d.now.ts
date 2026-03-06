import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['a2e4e82d48d9452e813c537c6686711d'],
    name: 'Deal Type Validation - Plan Targets',
    table: 'x_823178_commissio_plan_targets',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan target records use active governed deal types',
    script: Now.include('./sys_script_a2e4e82d48d9452e813c537c6686711d.server.js'),
})
