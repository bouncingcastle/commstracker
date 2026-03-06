import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['e06f2f2bc49440e38d51880b45e0bda3'],
    name: 'Plan Recognition Policy Validation',
    table: 'x_823178_commissio_plan_recognition_policies',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates recognition basis policy versions, date ranges, and change controls',
    script: Now.include('./sys_script_e06f2f2bc49440e38d51880b45e0bda3.server.js'),
})
