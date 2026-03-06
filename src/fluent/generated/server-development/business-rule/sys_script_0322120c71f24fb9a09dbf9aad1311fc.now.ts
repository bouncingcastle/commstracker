import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['0322120c71f24fb9a09dbf9aad1311fc'],
    name: 'Deal Type Validation - Plan Targets',
    table: 'x_823178_commissio_plan_targets',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan target records use active governed deal types',
    script: Now.include('./sys_script_0322120c71f24fb9a09dbf9aad1311fc.server.js'),
})
