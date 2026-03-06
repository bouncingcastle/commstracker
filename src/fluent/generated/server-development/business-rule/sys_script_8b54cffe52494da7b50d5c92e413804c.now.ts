import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['8b54cffe52494da7b50d5c92e413804c'],
    name: 'Deal Type Validation - Deals',
    table: 'x_823178_commissio_deals',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures deal records use active governed deal types',
    script: Now.include('./sys_script_8b54cffe52494da7b50d5c92e413804c.server.js'),
})
