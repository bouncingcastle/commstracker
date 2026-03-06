import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['3143b07ae4cc42daab540ff5ed86f91c'],
    name: 'Plan Recognition Policy Validation',
    table: 'x_823178_commissio_plan_recognition_policies',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates recognition basis policy versions, date ranges, and change controls',
    script: Now.include('./sys_script_3143b07ae4cc42daab540ff5ed86f91c.server.js'),
})
