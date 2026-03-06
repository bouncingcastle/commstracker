import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['f892897045a040df99cf7c675ceea713'],
    name: 'Plan Recognition Policy Validation',
    table: 'x_823178_commissio_plan_recognition_policies',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates recognition basis policy versions, date ranges, and change controls',
    script: Now.include('./sys_script_f892897045a040df99cf7c675ceea713.server.js'),
})
