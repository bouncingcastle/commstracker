import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['02682d056f364bc29089a195743ad4cf'],
    name: 'Deal Type Validation - Plan Targets',
    table: 'x_823178_commissio_plan_targets',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan target records use active governed deal types',
    script: Now.include('./sys_script_02682d056f364bc29089a195743ad4cf.server.js'),
})
