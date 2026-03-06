import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['80307b6072c4457d95f55b30a1b56c8f'],
    name: 'Deal Type Validation - Plan Targets',
    table: 'x_823178_commissio_plan_targets',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan target records use active governed deal types',
    script: Now.include('./sys_script_80307b6072c4457d95f55b30a1b56c8f.server.js'),
})
