import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['e230f89241f14e249a4111ee95e7f8ed'],
    name: 'Plan Bonus Validation',
    table: 'x_823178_commissio_plan_bonuses',
    order: 42,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates structured bonus qualification fields and composes a deterministic condition summary',
    script: Now.include('./sys_script_e230f89241f14e249a4111ee95e7f8ed.server.js'),
})
