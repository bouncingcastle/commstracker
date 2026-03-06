import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['6ebe222108f7414191664e7b2e733ea9'],
    name: 'Deal Classification Validation',
    table: 'x_823178_commissio_deal_classifications',
    order: 50,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Prevents duplicate classifications and enforces single-primary semantics per deal',
    script: Now.include('./sys_script_6ebe222108f7414191664e7b2e733ea9.server.js'),
})
