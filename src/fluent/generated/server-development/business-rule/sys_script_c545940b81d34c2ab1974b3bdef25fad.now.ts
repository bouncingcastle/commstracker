import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['c545940b81d34c2ab1974b3bdef25fad'],
    name: 'Plan Bonus Validation',
    table: 'x_823178_commissio_plan_bonuses',
    order: 42,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates structured bonus qualification fields and composes a deterministic condition summary',
    script: Now.include('./sys_script_c545940b81d34c2ab1974b3bdef25fad.server.js'),
})
