import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['c1c86fd82d164bc4ae86045128e790b5'],
    name: 'Plan Recognition Policy Validation',
    table: 'x_823178_commissio_plan_recognition_policies',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates recognition basis policy versions, date ranges, and change controls',
    script: Now.include('./sys_script_c1c86fd82d164bc4ae86045128e790b5.server.js'),
})
