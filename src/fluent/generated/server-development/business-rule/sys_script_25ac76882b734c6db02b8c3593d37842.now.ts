import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['25ac76882b734c6db02b8c3593d37842'],
    name: 'Plan Recognition Policy Validation',
    table: 'x_823178_commissio_plan_recognition_policies',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates recognition basis policy versions, date ranges, and change controls',
    script: Now.include('./sys_script_25ac76882b734c6db02b8c3593d37842.server.js'),
})
