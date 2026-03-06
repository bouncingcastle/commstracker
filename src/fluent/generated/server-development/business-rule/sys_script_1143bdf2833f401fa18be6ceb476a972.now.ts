import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['1143bdf2833f401fa18be6ceb476a972'],
    name: 'Deal Type Validation - Plan Bonuses',
    table: 'x_823178_commissio_plan_bonuses',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan bonus records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_1143bdf2833f401fa18be6ceb476a972.server.js'),
})
