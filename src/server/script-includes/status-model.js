export const PAYMENT_CALC_STATE = {
    CALCULATED: 'calculated',
    PENDING: 'pending',
    ERROR: 'error'
};

export const CALC_STATUS = {
    DRAFT: 'draft',
    LOCKED: 'locked',
    PAID: 'paid'
};

export const STATEMENT_STATUS = {
    DRAFT: 'draft',
    LOCKED: 'locked',
    PAID: 'paid'
};

export const APPROVAL_STATUS = {
    SUBMITTED: 'submitted',
    IN_REVIEW: 'in_review',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    CANCELLED: 'cancelled'
};

const APPROVAL_TRANSITIONS = {
    submitted: { in_review: true, cancelled: true },
    in_review: { approved: true, rejected: true, cancelled: true },
    rejected: { in_review: true, cancelled: true },
    approved: {},
    cancelled: {}
};

export function isApprovalTransitionAllowed(fromStatus, toStatus) {
    return !!(APPROVAL_TRANSITIONS[fromStatus] && APPROVAL_TRANSITIONS[fromStatus][toStatus]);
}
