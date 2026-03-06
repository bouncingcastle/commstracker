import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['f1ba1e7bebaf471780fddb851806eaef'],
    name: 'Deal Type Validation - Plan Targets',
    table: 'x_823178_commissio_plan_targets',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan target records use active governed deal types',
    script: Now.include('./sys_script_f1ba1e7bebaf471780fddb851806eaef.server.js'),
})
