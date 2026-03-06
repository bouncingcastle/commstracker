import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['b09bc948e4844044a292b36d8d1f23f9'],
    name: 'Plan Recognition Policy Validation',
    table: 'x_823178_commissio_plan_recognition_policies',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates recognition basis policy versions, date ranges, and change controls',
    script: Now.include('./sys_script_b09bc948e4844044a292b36d8d1f23f9.server.js'),
})
