import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['6b7d7f4c667246d2927081974b415beb'],
    name: 'Deal Type Validation - Plan Bonuses',
    table: 'x_823178_commissio_plan_bonuses',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan bonus records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_6b7d7f4c667246d2927081974b415beb.server.js'),
})
