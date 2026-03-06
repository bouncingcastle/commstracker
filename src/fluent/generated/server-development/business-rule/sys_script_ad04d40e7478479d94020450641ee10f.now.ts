import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['ad04d40e7478479d94020450641ee10f'],
    name: 'Deal Type Validation - Plan Targets',
    table: 'x_823178_commissio_plan_targets',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan target records use active governed deal types',
    script: Now.include('./sys_script_ad04d40e7478479d94020450641ee10f.server.js'),
})
