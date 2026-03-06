import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['d8f7ed6a0fe14c11904d9590aee4ab41'],
    name: 'Deal Type Validation - Plan Tiers',
    table: 'x_823178_commissio_plan_tiers',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan tier records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_d8f7ed6a0fe14c11904d9590aee4ab41.server.js'),
})
