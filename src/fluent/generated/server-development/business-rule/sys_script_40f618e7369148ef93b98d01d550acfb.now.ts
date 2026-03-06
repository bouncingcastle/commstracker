import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['40f618e7369148ef93b98d01d550acfb'],
    name: 'Deal Type Validation - Plan Tiers',
    table: 'x_823178_commissio_plan_tiers',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan tier records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_40f618e7369148ef93b98d01d550acfb.server.js'),
})
