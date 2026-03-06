import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['cb831f54720e4501a8fa3c239e7f83a0'],
    name: 'Deal Type Validation - Plan Targets',
    table: 'x_823178_commissio_plan_targets',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan target records use active governed deal types',
    script: Now.include('./sys_script_cb831f54720e4501a8fa3c239e7f83a0.server.js'),
})
