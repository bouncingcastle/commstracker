import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['427db5de13a843918c14530e2d364499'],
    name: 'Plan Recognition Policy Validation',
    table: 'x_823178_commissio_plan_recognition_policies',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates recognition basis policy versions, date ranges, and change controls',
    script: Now.include('./sys_script_427db5de13a843918c14530e2d364499.server.js'),
})
