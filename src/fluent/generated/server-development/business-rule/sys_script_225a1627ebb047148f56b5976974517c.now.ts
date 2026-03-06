import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['225a1627ebb047148f56b5976974517c'],
    name: 'Deal Type Validation - Plan Targets',
    table: 'x_823178_commissio_plan_targets',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan target records use active governed deal types',
    script: Now.include('./sys_script_225a1627ebb047148f56b5976974517c.server.js'),
})
