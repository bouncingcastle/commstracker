import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['21e7e8d308d64cd185549ab568f90ee5'],
    name: 'Plan Recognition Policy Validation',
    table: 'x_823178_commissio_plan_recognition_policies',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates recognition basis policy versions, date ranges, and change controls',
    script: Now.include('./sys_script_21e7e8d308d64cd185549ab568f90ee5.server.js'),
})
