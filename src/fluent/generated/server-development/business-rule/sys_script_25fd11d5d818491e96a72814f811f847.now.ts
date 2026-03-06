import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['25fd11d5d818491e96a72814f811f847'],
    name: 'Plan Recognition Policy Validation',
    table: 'x_823178_commissio_plan_recognition_policies',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates recognition basis policy versions, date ranges, and change controls',
    script: Now.include('./sys_script_25fd11d5d818491e96a72814f811f847.server.js'),
})
