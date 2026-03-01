import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import { validateManagerTeamMembership } from '../../server/business-rules/manager-team-governance.js'

BusinessRule({
    $id: 'manager_team_governance_validation',
    name: 'Manager Team Governance Validation',
    table: 'x_823178_commissio_manager_team_memberships',
    action: ['insert', 'update'],
    when: 'before',
    script: validateManagerTeamMembership,
    active: true,
    order: 35,
    description: 'Validates manager-team memberships, date windows, and role governance constraints'
})
