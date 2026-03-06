import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['5a06f1bd1c8f4026bf5b66b766ac151d'],
    name: 'Deal Type Validation - Plan Bonuses',
    table: 'x_823178_commissio_plan_bonuses',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan bonus records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_5a06f1bd1c8f4026bf5b66b766ac151d.server.js'),
})
