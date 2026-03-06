import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['4d6b18e1a4a54a2c92888136768263be'],
    name: 'Deal Type Validation - Plan Bonuses',
    table: 'x_823178_commissio_plan_bonuses',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan bonus records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_4d6b18e1a4a54a2c92888136768263be.server.js'),
})
