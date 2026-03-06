import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['64a380416e0b4cb9b76750a1def31beb'],
    name: 'Deal Type Validation - Plan Tiers',
    table: 'x_823178_commissio_plan_tiers',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan tier records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_64a380416e0b4cb9b76750a1def31beb.server.js'),
})
