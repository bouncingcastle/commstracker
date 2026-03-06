import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['0826c3c0c0db41e9869bdbd24c9e776b'],
    name: 'Deal Type Validation - Plan Tiers',
    table: 'x_823178_commissio_plan_tiers',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan tier records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_0826c3c0c0db41e9869bdbd24c9e776b.server.js'),
})
