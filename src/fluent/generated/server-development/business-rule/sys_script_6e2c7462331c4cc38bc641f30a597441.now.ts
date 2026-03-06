import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['6e2c7462331c4cc38bc641f30a597441'],
    name: 'Plan Recognition Policy Validation',
    table: 'x_823178_commissio_plan_recognition_policies',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates recognition basis policy versions, date ranges, and change controls',
    script: Now.include('./sys_script_6e2c7462331c4cc38bc641f30a597441.server.js'),
})
