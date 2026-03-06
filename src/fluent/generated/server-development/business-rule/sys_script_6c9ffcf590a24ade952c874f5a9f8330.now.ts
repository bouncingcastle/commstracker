import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['6c9ffcf590a24ade952c874f5a9f8330'],
    name: 'Deal Type Validation - Plan Targets',
    table: 'x_823178_commissio_plan_targets',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan target records use active governed deal types',
    script: Now.include('./sys_script_6c9ffcf590a24ade952c874f5a9f8330.server.js'),
})
