import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['7c08658de002468894c0c478cad68b39'],
    name: 'Plan Bonus Validation',
    table: 'x_823178_commissio_plan_bonuses',
    order: 42,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates structured bonus qualification fields and composes a deterministic condition summary',
    script: Now.include('./sys_script_7c08658de002468894c0c478cad68b39.server.js'),
})
