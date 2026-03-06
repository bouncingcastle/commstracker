import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['47656692e5304c1bbf29af1470f44016'],
    name: 'Deal Type Validation - Plan Bonuses',
    table: 'x_823178_commissio_plan_bonuses',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan bonus records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_47656692e5304c1bbf29af1470f44016.server.js'),
})
