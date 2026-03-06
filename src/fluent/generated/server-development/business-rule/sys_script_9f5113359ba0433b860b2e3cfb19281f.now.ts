import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['9f5113359ba0433b860b2e3cfb19281f'],
    name: 'Deal Type Validation - Plan Tiers',
    table: 'x_823178_commissio_plan_tiers',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan tier records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_9f5113359ba0433b860b2e3cfb19281f.server.js'),
})
