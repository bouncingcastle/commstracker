import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['74ef8412c45b4f5e837323c812d2ada1'],
    name: 'Deal Classification Validation',
    table: 'x_823178_commissio_deal_classifications',
    order: 50,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Prevents duplicate classifications and enforces single-primary semantics per deal',
    script: Now.include('./sys_script_74ef8412c45b4f5e837323c812d2ada1.server.js'),
})
