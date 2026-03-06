import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['814ddb4d7d8c4320a42d8409809fee50'],
    name: 'Deal Type Validation - Plan Targets',
    table: 'x_823178_commissio_plan_targets',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan target records use active governed deal types',
    script: Now.include('./sys_script_814ddb4d7d8c4320a42d8409809fee50.server.js'),
})
