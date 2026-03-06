import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['156eeb275d79401d9e983c2de789d5ff'],
    name: 'Plan Bonus Validation',
    table: 'x_823178_commissio_plan_bonuses',
    order: 42,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates structured bonus qualification fields and composes a deterministic condition summary',
    script: Now.include('./sys_script_156eeb275d79401d9e983c2de789d5ff.server.js'),
})
