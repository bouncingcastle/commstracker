import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['8cef00b4d65046fcbc697998d458b7af'],
    name: 'Deal Type Validation - Plan Targets',
    table: 'x_823178_commissio_plan_targets',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan target records use active governed deal types',
    script: Now.include('./sys_script_8cef00b4d65046fcbc697998d458b7af.server.js'),
})
