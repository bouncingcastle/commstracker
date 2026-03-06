import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['f047f35bead949dea6e49294d55fa4b5'],
    name: 'Deal Classification Validation',
    table: 'x_823178_commissio_deal_classifications',
    order: 50,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Prevents duplicate classifications and enforces single-primary semantics per deal',
    script: Now.include('./sys_script_f047f35bead949dea6e49294d55fa4b5.server.js'),
})
