import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['34e904c5cd174640a988172ba430a10b'],
    name: 'Plan Recognition Policy Validation',
    table: 'x_823178_commissio_plan_recognition_policies',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates recognition basis policy versions, date ranges, and change controls',
    script: Now.include('./sys_script_34e904c5cd174640a988172ba430a10b.server.js'),
})
