import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['d0e23a9745ae41ce91f86a298ebdfc77'],
    name: 'Deal Type Validation - Plan Bonuses',
    table: 'x_823178_commissio_plan_bonuses',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan bonus records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_d0e23a9745ae41ce91f86a298ebdfc77.server.js'),
})
