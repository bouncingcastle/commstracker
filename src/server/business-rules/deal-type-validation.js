import { gs, GlideRecord } from '@servicenow/glide'

export function validateDealTypeOnDeal(current, previous) {
    validateDealTypeReference(current, {
        refField: 'deal_type_ref',
        allowEmpty: false,
        contextLabel: 'Deal'
    });
}

export function validateDealTypeOnPlanTarget(current, previous) {
    validateDealTypeReference(current, {
        refField: 'deal_type_ref',
        allowEmpty: false,
        contextLabel: 'Plan Target'
    });

    var targetAmount = parseFloat(current.getValue('annual_target_amount')) || 0;
    if (targetAmount <= 0) {
        gs.addErrorMessage('Plan Target annual target amount must be greater than 0.');
        current.setAbortAction(true);
        return;
    }

    var rate = parseFloat(current.getValue('commission_rate_percent')) || 0;
    if (rate <= 0 || rate > 100) {
        gs.addErrorMessage('Plan Target commission rate must be greater than 0 and at most 100.');
        current.setAbortAction(true);
    }
}

export function validateDealTypeOnPlanBonus(current, previous) {
    validateDealTypeReference(current, {
        refField: 'deal_type_ref',
        allowEmpty: true,
        contextLabel: 'Plan Bonus'
    });
}

export function validateDealTypeOnCalculation(current, previous) {
    validateDealTypeReference(current, {
        refField: 'deal_type_ref',
        allowEmpty: false,
        contextLabel: 'Commission Calculation'
    });
}

function validateDealTypeReference(current, options) {
    var refFieldName = options.refField || 'deal_type_ref';
    var rawRef = (current.getValue(refFieldName) || '').toString().trim();

    if (!rawRef) {
        if (options.allowEmpty) {
            return;
        }
        gs.addErrorMessage(options.contextLabel + ' requires a Deal Type reference.');
        current.setAbortAction(true);
        return;
    }

    var byRef = getActiveDealTypeById(rawRef);
    if (!byRef) {
        gs.addErrorMessage(options.contextLabel + ' references an inactive or missing Deal Type record.');
        current.setAbortAction(true);
    }
}

function getActiveDealTypeById(sysId) {
    if (!sysId) {
        return null;
    }

    var typeGr = new GlideRecord('x_823178_commissio_deal_types');
    if (!typeGr.get(sysId)) {
        return null;
    }

    if (!isActiveFlag(typeGr.getValue('is_active'))) {
        return null;
    }

    return {
        id: typeGr.getUniqueValue(),
        code: (typeGr.getValue('code') || '').toString()
    };
}

function isActiveFlag(value) {
    if (value === true || value === 1) {
        return true;
    }

    var normalized = (value || '').toString().toLowerCase();
    return normalized === 'true' || normalized === '1';
}

