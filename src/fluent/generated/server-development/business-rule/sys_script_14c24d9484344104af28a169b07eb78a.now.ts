import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['14c24d9484344104af28a169b07eb78a'],
    name: 'Plan Recognition Policy Validation',
    table: 'x_823178_commissio_plan_recognition_policies',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates recognition basis policy versions, date ranges, and change controls',
    script: Now.include('./sys_script_14c24d9484344104af28a169b07eb78a.server.js'),
})
