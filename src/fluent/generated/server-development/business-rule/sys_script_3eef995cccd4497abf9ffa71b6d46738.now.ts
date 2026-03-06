import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['3eef995cccd4497abf9ffa71b6d46738'],
    name: 'Plan Recognition Policy Validation',
    table: 'x_823178_commissio_plan_recognition_policies',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates recognition basis policy versions, date ranges, and change controls',
    script: Now.include('./sys_script_3eef995cccd4497abf9ffa71b6d46738.server.js'),
})
