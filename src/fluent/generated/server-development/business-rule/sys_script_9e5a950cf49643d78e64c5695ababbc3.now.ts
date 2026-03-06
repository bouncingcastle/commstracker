import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['9e5a950cf49643d78e64c5695ababbc3'],
    name: 'Deal Type Validation - Plan Bonuses',
    table: 'x_823178_commissio_plan_bonuses',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan bonus records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_9e5a950cf49643d78e64c5695ababbc3.server.js'),
})
