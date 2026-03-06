import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['f2ed3409084442858c516186db3597e3'],
    name: 'Deal Type Validation - Calculations',
    table: 'x_823178_commissio_commission_calculations',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates calculation deal type against active governed deal types when value is present',
    script: Now.include('./sys_script_f2ed3409084442858c516186db3597e3.server.js'),
})
