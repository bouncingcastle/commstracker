import { gs } from '@servicenow/glide'

const ROLES = {
    admin: 'x_823178_commissio.admin',
    manager: 'x_823178_commissio.manager',
    finance: 'x_823178_commissio.finance',
    rep: 'x_823178_commissio.rep'
}

export function resolveCommissionRoleAccess(user) {
    var subject = user || gs.getUser()

    var roles = {
        admin: hasRole(subject, ROLES.admin) || hasRole(subject, 'admin'),
        manager: hasRole(subject, ROLES.manager),
        finance: hasRole(subject, ROLES.finance),
        rep: hasRole(subject, ROLES.rep)
    }

    if (roles.admin || roles.manager || roles.finance) {
        roles.rep = true
    }

    return {
        roles: roles,
        canSelectUsers: !!(roles.admin || roles.manager || roles.finance),
        canViewAllUsers: !!(roles.admin || roles.finance),
        canViewTeamRollup: !!(roles.admin || roles.manager),
        canReviewStatements: !!(roles.admin || roles.finance)
    }
}

export function hasStatementReviewerAccess(user) {
    return !!resolveCommissionRoleAccess(user).canReviewStatements
}

function hasRole(user, roleName) {
    try {
        if (!user || !roleName || typeof user.hasRole !== 'function') {
            return false
        }
        return !!user.hasRole(roleName)
    } catch (e) {
        return false
    }
}
