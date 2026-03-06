import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['de6431e5deda4a518b86b5546dc1c47b'],
    name: 'Deal Type Validation - Plan Targets',
    table: 'x_823178_commissio_plan_targets',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan target records use active governed deal types',
    script: Now.include('./sys_script_de6431e5deda4a518b86b5546dc1c47b.server.js'),
})
