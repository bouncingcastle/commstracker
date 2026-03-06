import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['8fe12cd9e5664d3b9fa5fc506e0874c1'],
    name: 'Deal Type Validation - Plan Bonuses',
    table: 'x_823178_commissio_plan_bonuses',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan bonus records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_8fe12cd9e5664d3b9fa5fc506e0874c1.server.js'),
})
