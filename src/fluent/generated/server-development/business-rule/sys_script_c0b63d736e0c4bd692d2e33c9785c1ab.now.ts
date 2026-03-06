import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['c0b63d736e0c4bd692d2e33c9785c1ab'],
    name: 'Plan Recognition Policy Validation',
    table: 'x_823178_commissio_plan_recognition_policies',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates recognition basis policy versions, date ranges, and change controls',
    script: Now.include('./sys_script_c0b63d736e0c4bd692d2e33c9785c1ab.server.js'),
})
