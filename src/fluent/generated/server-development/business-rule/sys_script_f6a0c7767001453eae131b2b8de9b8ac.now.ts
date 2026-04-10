import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['f6a0c7767001453eae131b2b8de9b8ac'],
    name: 'Deal Close Commission Draft',
    table: 'x_823178_commissio_deals',
    order: 200,
    when: 'after',
    action: ['update', 'insert'],
    description: 'Creates a draft commission calculation when a deal is closed won',
    script: Now.include('./sys_script_f6a0c7767001453eae131b2b8de9b8ac.server.js'),
})
