import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['75df4d2d8756489c8705af39791ac169'],
    name: 'Deal Classification Validation',
    table: 'x_823178_commissio_deal_classifications',
    order: 50,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Prevents duplicate classifications and enforces single-primary semantics per deal',
    script: Now.include('./sys_script_75df4d2d8756489c8705af39791ac169.server.js'),
})
