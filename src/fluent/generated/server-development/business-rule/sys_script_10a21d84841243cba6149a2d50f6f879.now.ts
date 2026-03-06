import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['10a21d84841243cba6149a2d50f6f879'],
    name: 'Plan Recognition Policy Validation',
    table: 'x_823178_commissio_plan_recognition_policies',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates recognition basis policy versions, date ranges, and change controls',
    script: Now.include('./sys_script_10a21d84841243cba6149a2d50f6f879.server.js'),
})
