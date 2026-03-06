import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['2d1cce8ed4694c7d96559b6702b8e363'],
    name: 'Plan Recognition Policy Validation',
    table: 'x_823178_commissio_plan_recognition_policies',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates recognition basis policy versions, date ranges, and change controls',
    script: Now.include('./sys_script_2d1cce8ed4694c7d96559b6702b8e363.server.js'),
})
