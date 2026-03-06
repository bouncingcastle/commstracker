import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['7fcbb7a9464441b0b1590c5c66f2088e'],
    name: 'Deal Classification Validation',
    table: 'x_823178_commissio_deal_classifications',
    order: 50,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Prevents duplicate classifications and enforces single-primary semantics per deal',
    script: Now.include('./sys_script_7fcbb7a9464441b0b1590c5c66f2088e.server.js'),
})
