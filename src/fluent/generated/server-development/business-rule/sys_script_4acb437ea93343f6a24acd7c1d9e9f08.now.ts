import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['4acb437ea93343f6a24acd7c1d9e9f08'],
    name: 'Plan Bonus Validation',
    table: 'x_823178_commissio_plan_bonuses',
    order: 42,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates structured bonus qualification fields and composes a deterministic condition summary',
    script: Now.include('./sys_script_4acb437ea93343f6a24acd7c1d9e9f08.server.js'),
})
