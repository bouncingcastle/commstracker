import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['998068eeb06a4148b96ea3fd75dd132f'],
    name: 'Deal Classification Validation',
    table: 'x_823178_commissio_deal_classifications',
    order: 50,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Prevents duplicate classifications and enforces single-primary semantics per deal',
    script: Now.include('./sys_script_998068eeb06a4148b96ea3fd75dd132f.server.js'),
})
