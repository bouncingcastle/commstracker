import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['3a5ebf82381447e38bb58ac61ea81632'],
    name: 'Deal Type Validation - Plan Targets',
    table: 'x_823178_commissio_plan_targets',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan target records use active governed deal types',
    script: Now.include('./sys_script_3a5ebf82381447e38bb58ac61ea81632.server.js'),
})
