import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['c34498a65920482e9a2c86c44770dbf4'],
    name: 'Plan Recognition Policy Validation',
    table: 'x_823178_commissio_plan_recognition_policies',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates recognition basis policy versions, date ranges, and change controls',
    script: Now.include('./sys_script_c34498a65920482e9a2c86c44770dbf4.server.js'),
})
