import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['f1392fac120b4f2c99690fcefd1f1a9b'],
    name: 'Deal Classification Validation',
    table: 'x_823178_commissio_deal_classifications',
    order: 50,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Prevents duplicate classifications and enforces single-primary semantics per deal',
    script: Now.include('./sys_script_f1392fac120b4f2c99690fcefd1f1a9b.server.js'),
})
