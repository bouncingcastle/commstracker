import { gs, GlideRecord } from '@servicenow/glide'

export function validateDealTypeOnDeal(current, previous) {
    validateDealType(current, {
        field: 'deal_type',
        allowEmpty: false,
        allowSpecialScopes: false,
        contextLabel: 'Deal'
    });
}

export function validateDealTypeOnPlanTarget(current, previous) {
    validateDealType(current, {
        field: 'deal_type',
        allowEmpty: false,
        allowSpecialScopes: false,
        contextLabel: 'Plan Target'
    });
}

export function validateDealTypeOnPlanBonus(current, previous) {
    validateDealType(current, {
        field: 'deal_type',
        allowEmpty: true,
        allowSpecialScopes: true,
        contextLabel: 'Plan Bonus'
    });
}

export function validateDealTypeOnPlanTier(current, previous) {
    validateDealType(current, {
        field: 'deal_type',
        allowEmpty: true,
        allowSpecialScopes: true,
        contextLabel: 'Plan Tier'
    });
}

export function validateDealTypeOnCalculation(current, previous) {
    validateDealType(current, {
        field: 'deal_type',
        allowEmpty: true,
        allowSpecialScopes: false,
        contextLabel: 'Commission Calculation'
    });
}

function validateDealType(current, options) {
    var fieldName = options.field;
    var rawValue = (current.getValue(fieldName) || '').toString().trim();

    if (!rawValue) {
        if (options.allowEmpty) {
            return;
        }
        gs.addErrorMessage(options.contextLabel + ' requires a deal type value.');
        current.setAbortAction(true);
        return;
    }

    var normalized = rawValue;
    if (normalized === 'any' || normalized === 'all') {
        if (options.allowSpecialScopes) {
            return;
        }
        gs.addErrorMessage(options.contextLabel + ' does not allow scope values "any" or "all". Select a governed deal type.');
        current.setAbortAction(true);
        return;
    }

    if (!isActiveDealType(normalized)) {
        gs.addErrorMessage(options.contextLabel + ' deal type "' + normalized + '" is not an active governed deal type.');
        current.setAbortAction(true);
    }
}

function isActiveDealType(code) {
    var typeGr = new GlideRecord('x_823178_commissio_deal_types');
    typeGr.addQuery('code', code);
    typeGr.addQuery('is_active', true);
    typeGr.setLimit(1);
    typeGr.query();
    return typeGr.next();
}
