import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['f545dffa0f614d1ba80b876e60635261'],
    name: 'Plan Recognition Policy Validation',
    table: 'x_823178_commissio_plan_recognition_policies',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates recognition basis policy versions, date ranges, and change controls',
    script: Now.include('./sys_script_f545dffa0f614d1ba80b876e60635261.server.js'),
})
