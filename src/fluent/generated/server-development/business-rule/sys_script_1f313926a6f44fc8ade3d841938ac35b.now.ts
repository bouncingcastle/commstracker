import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['1f313926a6f44fc8ade3d841938ac35b'],
    name: 'Deal Type Validation - Plan Bonuses',
    table: 'x_823178_commissio_plan_bonuses',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan bonus records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_1f313926a6f44fc8ade3d841938ac35b.server.js'),
})
