import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['9f2607d3d404451496af4f43ee369ff5'],
    name: 'Deal Type Validation - Plan Bonuses',
    table: 'x_823178_commissio_plan_bonuses',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan bonus records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_9f2607d3d404451496af4f43ee369ff5.server.js'),
})
