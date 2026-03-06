import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['9dd7e88bf17c4501b239cb51e143daee'],
    name: 'Plan Bonus Validation',
    table: 'x_823178_commissio_plan_bonuses',
    order: 42,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates structured bonus qualification fields and composes a deterministic condition summary',
    script: Now.include('./sys_script_9dd7e88bf17c4501b239cb51e143daee.server.js'),
})
