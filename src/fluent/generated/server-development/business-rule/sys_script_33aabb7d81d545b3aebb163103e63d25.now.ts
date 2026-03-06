import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['33aabb7d81d545b3aebb163103e63d25'],
    name: 'Manager Team Governance Validation',
    table: 'x_823178_commissio_manager_team_memberships',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates manager-team memberships, date windows, and role governance constraints',
    script: Now.include('./sys_script_33aabb7d81d545b3aebb163103e63d25.server.js'),
})
