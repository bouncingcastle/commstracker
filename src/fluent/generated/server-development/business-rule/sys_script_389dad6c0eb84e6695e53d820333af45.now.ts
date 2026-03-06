import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['389dad6c0eb84e6695e53d820333af45'],
    name: 'Deal Type Validation - Plan Tiers',
    table: 'x_823178_commissio_plan_tiers',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan tier records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_389dad6c0eb84e6695e53d820333af45.server.js'),
})
