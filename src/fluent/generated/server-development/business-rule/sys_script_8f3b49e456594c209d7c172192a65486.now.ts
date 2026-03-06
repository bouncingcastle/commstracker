import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['8f3b49e456594c209d7c172192a65486'],
    name: 'Plan Bonus Validation',
    table: 'x_823178_commissio_plan_bonuses',
    order: 42,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates structured bonus qualification fields and composes a deterministic condition summary',
    script: Now.include('./sys_script_8f3b49e456594c209d7c172192a65486.server.js'),
})
