import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['0c6481bb542548c7b8a234e0d5cbc628'],
    name: 'Deal Type Validation - Plan Targets',
    table: 'x_823178_commissio_plan_targets',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan target records use active governed deal types',
    script: Now.include('./sys_script_0c6481bb542548c7b8a234e0d5cbc628.server.js'),
})
