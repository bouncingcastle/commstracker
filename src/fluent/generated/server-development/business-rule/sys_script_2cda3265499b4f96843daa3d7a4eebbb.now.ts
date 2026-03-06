import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['2cda3265499b4f96843daa3d7a4eebbb'],
    name: 'Deal Type Validation - Plan Targets',
    table: 'x_823178_commissio_plan_targets',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan target records use active governed deal types',
    script: Now.include('./sys_script_2cda3265499b4f96843daa3d7a4eebbb.server.js'),
})
