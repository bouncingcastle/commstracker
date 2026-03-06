import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['29fab75cd0194de0a91e1cde1ab2ed12'],
    name: 'Deal Classification Validation',
    table: 'x_823178_commissio_deal_classifications',
    order: 50,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Prevents duplicate classifications and enforces single-primary semantics per deal',
    script: Now.include('./sys_script_29fab75cd0194de0a91e1cde1ab2ed12.server.js'),
})
