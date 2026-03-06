import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['ba0137b848dc4d23a91c5dab24f3d8e0'],
    name: 'Deal Classification Validation',
    table: 'x_823178_commissio_deal_classifications',
    order: 50,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Prevents duplicate classifications and enforces single-primary semantics per deal',
    script: Now.include('./sys_script_ba0137b848dc4d23a91c5dab24f3d8e0.server.js'),
})
