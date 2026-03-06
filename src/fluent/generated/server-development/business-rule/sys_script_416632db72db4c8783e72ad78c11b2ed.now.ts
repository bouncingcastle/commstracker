import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['416632db72db4c8783e72ad78c11b2ed'],
    name: 'Deal Classification Validation',
    table: 'x_823178_commissio_deal_classifications',
    order: 50,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Prevents duplicate classifications and enforces single-primary semantics per deal',
    script: Now.include('./sys_script_416632db72db4c8783e72ad78c11b2ed.server.js'),
})
