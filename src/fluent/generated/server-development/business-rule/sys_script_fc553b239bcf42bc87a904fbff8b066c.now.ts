import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['fc553b239bcf42bc87a904fbff8b066c'],
    name: 'Deal Type Validation - Deals',
    table: 'x_823178_commissio_deals',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures deal records use active governed deal types',
    script: Now.include('./sys_script_fc553b239bcf42bc87a904fbff8b066c.server.js'),
})
