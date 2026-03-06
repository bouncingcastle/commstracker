import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['95ffdff40361493e82d14bbb80e6b925'],
    name: 'Deal Type Validation - Deals',
    table: 'x_823178_commissio_deals',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures deal records use active governed deal types',
    script: Now.include('./sys_script_95ffdff40361493e82d14bbb80e6b925.server.js'),
})
