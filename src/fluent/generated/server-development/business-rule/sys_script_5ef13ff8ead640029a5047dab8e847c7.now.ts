import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['5ef13ff8ead640029a5047dab8e847c7'],
    name: 'Plan Recognition Policy Validation',
    table: 'x_823178_commissio_plan_recognition_policies',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates recognition basis policy versions, date ranges, and change controls',
    script: Now.include('./sys_script_5ef13ff8ead640029a5047dab8e847c7.server.js'),
})
