import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['5ba88c9f50064505aa62c7c09a256f1d'],
    name: 'Plan Recognition Policy Validation',
    table: 'x_823178_commissio_plan_recognition_policies',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates recognition basis policy versions, date ranges, and change controls',
    script: Now.include('./sys_script_5ba88c9f50064505aa62c7c09a256f1d.server.js'),
})
