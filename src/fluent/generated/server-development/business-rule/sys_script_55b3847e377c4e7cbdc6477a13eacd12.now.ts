import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['55b3847e377c4e7cbdc6477a13eacd12'],
    name: 'Deal Type Validation - Plan Targets',
    table: 'x_823178_commissio_plan_targets',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan target records use active governed deal types',
    script: Now.include('./sys_script_55b3847e377c4e7cbdc6477a13eacd12.server.js'),
})
