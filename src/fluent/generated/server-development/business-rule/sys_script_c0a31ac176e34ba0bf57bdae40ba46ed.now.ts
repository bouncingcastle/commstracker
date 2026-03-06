import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['c0a31ac176e34ba0bf57bdae40ba46ed'],
    name: 'Plan Recognition Policy Validation',
    table: 'x_823178_commissio_plan_recognition_policies',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates recognition basis policy versions, date ranges, and change controls',
    script: Now.include('./sys_script_c0a31ac176e34ba0bf57bdae40ba46ed.server.js'),
})
