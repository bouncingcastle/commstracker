import { gs, GlideRecord } from '@servicenow/glide'


export function validateDealClassification(current, previous) {
    if (!current || !current.getValue('deal')) {
        return;
    }

    var dealId = current.getValue('deal');
    var dealTypeRef = (current.getValue('deal_type_ref') || '').toString();
    if (!dealTypeRef) {
        gs.addErrorMessage('Deal classification deal type reference is required.');
        current.setAbortAction(true);
        return;
    }

    var dealTypeGr = new GlideRecord('x_823178_commissio_deal_types');
    if (!dealTypeGr.get(dealTypeRef) || (dealTypeGr.getValue('is_active') !== 'true' && dealTypeGr.getValue('is_active') !== true)) {
        gs.addErrorMessage('Deal classification must reference an active governed Deal Type.');
        current.setAbortAction(true);
        return;
    }

    var duplicateGr = new GlideRecord('x_823178_commissio_deal_classifications');
    duplicateGr.addQuery('deal', dealId);
    duplicateGr.addQuery('deal_type_ref', dealTypeRef);
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
