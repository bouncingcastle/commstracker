import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide'

export function validateManagerTeamMembership(current, previous) {
    var managerId = (current.getValue('manager_user') || '').toString();
    var repId = (current.getValue('sales_rep') || '').toString();
    var startDate = (current.getValue('effective_start_date') || '').toString();
    var endDate = (current.getValue('effective_end_date') || '').toString();

    if (!managerId || !repId || !startDate) {
        gs.addErrorMessage('Manager, sales rep, and effective start date are required.');
        current.setAbortAction(true);
        return;
    }

    if (managerId === repId) {
        gs.addErrorMessage('Manager and sales rep must be different users.');
        current.setAbortAction(true);
        return;
    }

    if (endDate && isDateBefore(endDate, startDate)) {
        gs.addErrorMessage('Effective end date must be on or after effective start date.');
        current.setAbortAction(true);
        return;
    }

    if (!isActiveUser(managerId) || !isActiveUser(repId)) {
        gs.addErrorMessage('Manager and sales rep must both be active users.');
        current.setAbortAction(true);
        return;
    }

    if (!hasManagerRole(managerId)) {
        gs.addErrorMessage('Selected manager user does not have the Commission Manager role.');
        current.setAbortAction(true);
        return;
    }

    if (!toBool(current.getValue('is_active'))) {
        return;
    }

    if (hasOverlappingMembership(current, managerId, repId, startDate, endDate)) {
        gs.addErrorMessage('Active overlapping manager-team membership already exists for this manager and sales rep.');
        current.setAbortAction(true);
        return;
    }

    current.setValue('approved_by', gs.getUserID());
    current.setValue('approved_on', new GlideDateTime().getDisplayValue());
}

function hasOverlappingMembership(current, managerId, repId, startDate, endDate) {
    var gr = new GlideRecord('x_823178_commissio_manager_team_memberships');
    gr.addQuery('manager_user', managerId);
    gr.addQuery('sales_rep', repId);
    gr.addQuery('is_active', true);
    gr.addQuery('sys_id', '!=', current.getUniqueValue());
    gr.query();

    while (gr.next()) {
        var existingStart = (gr.getValue('effective_start_date') || '').toString();
        var existingEnd = (gr.getValue('effective_end_date') || '').toString();
        if (rangesOverlap(startDate, endDate, existingStart, existingEnd)) {
            return true;
        }
    }

    return false;
}

function rangesOverlap(startA, endA, startB, endB) {
    var aStart = normalizeDate(startA);
    var aEnd = normalizeDate(endA || '9999-12-31');
    var bStart = normalizeDate(startB);
    var bEnd = normalizeDate(endB || '9999-12-31');
    return aStart <= bEnd && bStart <= aEnd;
}

function normalizeDate(value) {
    return (value || '').toString().substring(0, 10);
}

function isDateBefore(a, b) {
    return normalizeDate(a) < normalizeDate(b);
}

function isActiveUser(userId) {
    var userGr = new GlideRecord('sys_user');
    if (!userGr.get(userId)) {
        return false;
    }
    return toBool(userGr.getValue('active'));
}

function hasManagerRole(userId) {
    var roleGr = new GlideRecord('sys_user_has_role');
    roleGr.addQuery('user', userId);
    roleGr.addQuery('role.name', 'x_823178_commissio.manager');
    roleGr.setLimit(1);
    roleGr.query();
    return roleGr.next();
}

function toBool(value) {
    return value === true || value === 'true' || value === '1' || value === 1;
}
