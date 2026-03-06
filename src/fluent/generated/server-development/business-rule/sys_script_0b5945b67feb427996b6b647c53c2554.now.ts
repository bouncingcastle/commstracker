import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['0b5945b67feb427996b6b647c53c2554'],
    name: 'Plan Bonus Validation',
    table: 'x_823178_commissio_plan_bonuses',
    order: 42,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates structured bonus qualification fields and composes a deterministic condition summary',
    script: Now.include('./sys_script_0b5945b67feb427996b6b647c53c2554.server.js'),
})
