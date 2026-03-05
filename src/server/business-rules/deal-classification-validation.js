import { gs, GlideRecord } from '@servicenow/glide'
import { normalizeDealType as normalizeDealTypeCanonical } from '../script-includes/deal-type-normalizer.js'

export function validateDealClassification(current, previous) {
    if (!current || !current.getValue('deal')) {
        return;
    }

    var dealId = current.getValue('deal');
    var dealType = normalizeDealType(current.getValue('deal_type'));
    if (!dealType) {
        gs.addErrorMessage('Deal classification type is required.');
        current.setAbortAction(true);
        return;
    }

    current.setValue('deal_type', dealType);

    var duplicateGr = new GlideRecord('x_823178_commissio_deal_classifications');
    duplicateGr.addQuery('deal', dealId);
    duplicateGr.addQuery('deal_type', dealType);
    duplicateGr.addQuery('sys_id', '!=', current.getUniqueValue());
    duplicateGr.query();

    if (duplicateGr.hasNext()) {
        gs.addErrorMessage('Duplicate deal classification: this deal already has that classification.');
        current.setAbortAction(true);
        return;
    }

    var isPrimary = current.getValue('is_primary') === 'true' || current.getValue('is_primary') === true;
    if (isPrimary) {
        var primaryGr = new GlideRecord('x_823178_commissio_deal_classifications');
        primaryGr.addQuery('deal', dealId);
        primaryGr.addQuery('is_primary', true);
        primaryGr.addQuery('sys_id', '!=', current.getUniqueValue());
        primaryGr.query();

        if (primaryGr.hasNext()) {
            gs.addErrorMessage('Only one primary classification is allowed per deal. Uncheck primary on the existing row first.');
            current.setAbortAction(true);
            return;
        }
    }

    if (!hasAnyPrimary(dealId, current.getUniqueValue(), isPrimary)) {
        current.setValue('is_primary', true);
    }

    if (!current.getValue('priority')) {
        current.setValue('priority', 100);
    }
}

function normalizeDealType(value) {
    var normalized = normalizeDealTypeCanonical(value, '');
    if (!normalized) {
        return '';
    }

    if (normalized === 'all' || normalized === 'new_business' || normalized === 'renewal' || normalized === 'expansion' || normalized === 'upsell') {
        return normalized;
    }

    return '';
}

function hasAnyPrimary(dealId, currentSysId, currentIsPrimary) {
    if (currentIsPrimary) {
        return true;
    }

    var primaryGr = new GlideRecord('x_823178_commissio_deal_classifications');
    primaryGr.addQuery('deal', dealId);
    primaryGr.addQuery('is_primary', true);
    primaryGr.addQuery('sys_id', '!=', currentSysId);
    primaryGr.query();

    return primaryGr.hasNext();
}
