import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['8b1eef7cb7a247f38aa948fe83ce10c9'],
    name: 'Deal Type Validation - Plan Tiers',
    table: 'x_823178_commissio_plan_tiers',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan tier records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_8b1eef7cb7a247f38aa948fe83ce10c9.server.js'),
})
