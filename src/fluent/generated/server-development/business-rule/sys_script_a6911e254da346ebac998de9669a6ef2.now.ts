import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['a6911e254da346ebac998de9669a6ef2'],
    name: 'Deal Type Validation - Plan Bonuses',
    table: 'x_823178_commissio_plan_bonuses',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan bonus records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_a6911e254da346ebac998de9669a6ef2.server.js'),
})
