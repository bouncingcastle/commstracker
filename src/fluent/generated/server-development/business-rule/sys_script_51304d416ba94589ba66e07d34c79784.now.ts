import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['51304d416ba94589ba66e07d34c79784'],
    name: 'Plan Bonus Validation',
    table: 'x_823178_commissio_plan_bonuses',
    order: 42,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates structured bonus qualification fields and composes a deterministic condition summary',
    script: Now.include('./sys_script_51304d416ba94589ba66e07d34c79784.server.js'),
})
