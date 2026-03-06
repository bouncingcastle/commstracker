import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['37d5f7adc6e84b0485b0fc6f08b9fafe'],
    name: 'Plan Recognition Policy Validation',
    table: 'x_823178_commissio_plan_recognition_policies',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates recognition basis policy versions, date ranges, and change controls',
    script: Now.include('./sys_script_37d5f7adc6e84b0485b0fc6f08b9fafe.server.js'),
})
