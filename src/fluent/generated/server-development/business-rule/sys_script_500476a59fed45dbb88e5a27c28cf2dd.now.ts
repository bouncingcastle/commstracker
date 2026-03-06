import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['500476a59fed45dbb88e5a27c28cf2dd'],
    name: 'Deal Type Validation - Plan Targets',
    table: 'x_823178_commissio_plan_targets',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan target records use active governed deal types',
    script: Now.include('./sys_script_500476a59fed45dbb88e5a27c28cf2dd.server.js'),
})
