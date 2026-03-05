export function normalizeDealType(value, fallback) {
    var normalized = (value || '').toString().toLowerCase();
    normalized = normalized.replace(/[\s\-]+/g, '_').replace(/__+/g, '_');
    normalized = normalized.replace(/^_+|_+$/g, '');

    var aliases = {
        seller_sourced: 'new_business',
        seller_sourced_deal: 'new_business',
        referral: 'renewal',
        referral_deal: 'renewal',
        referral_assigned: 'renewal',
        referral_deal_assigned: 'renewal'
    };

    if (aliases[normalized]) {
        return aliases[normalized];
    }

    return normalized || fallback || '';
}

export function normalizeTierScope(value) {
    return normalizeDealType(value, 'all');
}

export function normalizeBonusScope(value) {
    var normalized = normalizeDealType(value, 'any');
    return normalized === 'all' ? 'any' : normalized;
}
