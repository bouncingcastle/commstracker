import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide'

export function enforceDealTypeLifecycleGovernance(current, previous) {
    var code = (current.getValue('code') || '').toString().trim();
    if (!code) {
        gs.addErrorMessage('Deal Type code is required.');
        current.setAbortAction(true);
        return;
    }

    if (!/^[a-z][a-z0-9_]{1,39}$/.test(code)) {
        gs.addErrorMessage('Deal Type code must be snake_case, start with a letter, and be <= 40 characters.');
        current.setAbortAction(true);
        return;
    }

    // Ensure code uniqueness (case-insensitive safe pattern via exact compare in scoped dataset)
    var dupGr = new GlideRecord('x_823178_commissio_deal_types');
    dupGr.addQuery('code', code);
    dupGr.addQuery('sys_id', '!=', current.sys_id);
    dupGr.setLimit(1);
    dupGr.query();
    if (dupGr.next()) {
        gs.addErrorMessage('Deal Type code "' + code + '" already exists. Use a unique code.');
        current.setAbortAction(true);
        return;
    }

    if (!previous || !previous.sys_id) {
        return;
    }

    var priorCode = (previous.getValue('code') || '').toString().trim();
    var priorIsSystem = toBool(previous.getValue('is_system'));
    var wasActive = toBool(previous.getValue('is_active'));
    var nowActive = toBool(current.getValue('is_active'));

    if (priorIsSystem && priorCode !== code) {
        gs.addErrorMessage('System Deal Type code is immutable. Create a new deal type instead of renaming the code.');
        current.setAbortAction(true);
        return;
    }

    var isDeactivation = wasActive && !nowActive;
    if (!isDeactivation) {
        return;
    }

    var usage = collectUsageCounts(priorCode || code);
    if (!usage.hasUsage) {
        return;
    }

    if (!hasApprovedOverride(current.getUniqueValue(), 'deal_type_deprecation')) {
        gs.addErrorMessage(
            'Deal Type cannot be deactivated because it is still referenced. ' +
            formatUsageSummary(usage) +
            ' Submit exception request type "Deal Type Deprecation" to override after remediation.'
        );
        current.setAbortAction(true);
        return;
    }

    gs.addInfoMessage('Deal Type deactivation allowed via approved Deal Type Deprecation exception. ' + formatUsageSummary(usage));
    createGovernanceAuditAlert(code, usage);
}

function collectUsageCounts(code) {
    var usage = {
        deals: countByField('x_823178_commissio_deals', 'deal_type', code),
        planTargets: countByField('x_823178_commissio_plan_targets', 'deal_type', code),
        planTiers: countTierScope(code),
        planBonuses: countBonusScope(code),
        calculations: countByField('x_823178_commissio_commission_calculations', 'deal_type', code),
        hasUsage: false
    };

    usage.hasUsage = usage.deals > 0 || usage.planTargets > 0 || usage.planTiers > 0 || usage.planBonuses > 0 || usage.calculations > 0;
    return usage;
}

function countByField(table, field, value) {
    var gr = new GlideRecord(table);
    gr.addQuery(field, value);
    gr.query();
    return gr.getRowCount();
}

function countTierScope(code) {
    var gr = new GlideRecord('x_823178_commissio_plan_tiers');
    gr.addQuery('deal_type', code);
    gr.query();
    return gr.getRowCount();
}

function countBonusScope(code) {
    var gr = new GlideRecord('x_823178_commissio_plan_bonuses');
    gr.addQuery('deal_type', code);
    gr.query();
    return gr.getRowCount();
}

function hasApprovedOverride(recordId, requestType) {
    var approvalGr = new GlideRecord('x_823178_commissio_exception_approvals');
    approvalGr.addQuery('reference_record', recordId);
    approvalGr.addQuery('request_type', requestType);
    approvalGr.addQuery('status', 'approved');
    approvalGr.orderByDesc('approval_date');
    approvalGr.setLimit(1);
    approvalGr.query();
    return approvalGr.next();
}

function formatUsageSummary(usage) {
    return 'Usage counts => Deals: ' + usage.deals +
        ', Targets: ' + usage.planTargets +
        ', Tiers: ' + usage.planTiers +
        ', Bonuses: ' + usage.planBonuses +
        ', Calculations: ' + usage.calculations + '.';
}

function createGovernanceAuditAlert(code, usage) {
    try {
        var alertGr = new GlideRecord('x_823178_commissio_system_alerts');
        alertGr.initialize();
        alertGr.setValue('title', 'Deal Type Deprecation Override Applied');
        alertGr.setValue('message', 'Deal Type ' + code + ' was deactivated with approved override. ' + formatUsageSummary(usage));
        alertGr.setValue('severity', 'medium');
        alertGr.setValue('alert_date', new GlideDateTime().getDisplayValue());
        alertGr.setValue('status', 'open');
        alertGr.insert();
    } catch (e) {
        gs.error('Commission Management: Failed to create deal type governance audit alert - ' + e.message);
    }
}

function toBool(v) {
    return v === true || v === 'true' || v === '1' || v === 1;
}
