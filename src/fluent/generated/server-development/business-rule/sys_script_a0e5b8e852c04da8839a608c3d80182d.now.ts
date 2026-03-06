import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['a0e5b8e852c04da8839a608c3d80182d'],
    name: 'Plan Recognition Policy Validation',
    table: 'x_823178_commissio_plan_recognition_policies',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates recognition basis policy versions, date ranges, and change controls',
    script: Now.include('./sys_script_a0e5b8e852c04da8839a608c3d80182d.server.js'),
})
