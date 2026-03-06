import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['1485b00284cb4509901e1e3127d3648d'],
    name: 'Plan Recognition Policy Validation',
    table: 'x_823178_commissio_plan_recognition_policies',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates recognition basis policy versions, date ranges, and change controls',
    script: Now.include('./sys_script_1485b00284cb4509901e1e3127d3648d.server.js'),
})
