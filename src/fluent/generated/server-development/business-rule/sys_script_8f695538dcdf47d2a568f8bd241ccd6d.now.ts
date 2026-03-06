import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['8f695538dcdf47d2a568f8bd241ccd6d'],
    name: 'Deal Classification Validation',
    table: 'x_823178_commissio_deal_classifications',
    order: 50,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Prevents duplicate classifications and enforces single-primary semantics per deal',
    script: Now.include('./sys_script_8f695538dcdf47d2a568f8bd241ccd6d.server.js'),
})
