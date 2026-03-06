import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['5b1bbe0ece6043dda87af4287f22e8ab'],
    table: 'sysauto_script',
    data: {
        active: 'false',
        advanced: 'false',
        conditional: 'false',
        name: 'Commission Month-End Readiness Audit',
        run_time: '2026-03-05 21:25:48',
        run_type: 'daily',
        script: `import { gs, GlideAggregate, GlideDateTime } from '@servicenow/glide'
import { createSystemAlert, createReconciliationLog } from '../script-includes/ops-governance-utils.js'

export function runMonthEndReadinessAudit() {
    var startedAt = new GlideDateTime();
    var warnings = [];
    var errors = [];

    var target = resolveTargetPeriod();
    var yearStart = target.year + '-01-01';
    var monthStart = target.year + '-' + pad2(target.month) + '-01';
    var monthEnd = target.year + '-' + pad2(target.month) + '-' + pad2(daysInMonth(target.year, target.month));

    var metrics = {
        wonDeals: countByDateRange('x_823178_commissio_deals', 'close_date', monthStart, monthEnd, 'is_won=true'),
        payments: countByDateRange('x_823178_commissio_payments', 'payment_date', monthStart, monthEnd),
        calculations: countByDateRange('x_823178_commissio_commission_calculations', 'calculation_date', monthStart, monthEnd),
        statements: countStatementsForPeriod(target.year, target.month),
        pendingApprovals: countByQuery('x_823178_commissio_statement_approvals', 'statusINsubmitted,in_review'),
        unresolvedExceptions: countByQuery('x_823178_commissio_exception_approvals', 'statusINpending,under_review')
    };

    var stalePendingApprovals = countStalePendingApprovals();
    metrics.stalePendingApprovals = stalePendingApprovals;

    var orphanedLockedCalculations = countByQuery(
        'x_823178_commissio_commission_calculations',
        'statusINlocked,paid^statementISEMPTY^calculation_date>=' + monthStart + '^calculation_date<=' + monthEnd
    );
    metrics.orphanedLockedCalculations = orphanedLockedCalculations;

    if (metrics.calculations === 0) {
        warnings.push('No commission calculations found for target month ' + monthStart + ' to ' + monthEnd + '.');
    }

    if (metrics.statements === 0) {
        warnings.push('No commission statements generated for target period ' + target.year + '-' + pad2(target.month) + '.');
    }

    if (stalePendingApprovals > 0) {
        warnings.push('There are ' + stalePendingApprovals + ' stale pending approvals past SLA due date.');
    }

    if (orphanedLockedCalculations > 0) {
        errors.push(orphanedLockedCalculations + ' locked/paid calculations have no statement reference for target month.');
    }

    var finishedAt = new GlideDateTime();
    var elapsedMs = finishedAt.getNumericValue() - startedAt.getNumericValue();
    var processingSeconds = elapsedMs > 0 ? Math.round(elapsedMs / 1000) : 0;

    var status = 'passed';
    if (errors.length > 0) {
        status = 'failed';
    } else if (warnings.length > 0) {
        status = 'warning';
    }

    var details = [
        'Month-end readiness audit',
        'period=' + target.year + '-' + pad2(target.month),
        'wonDeals=' + metrics.wonDeals,
        'payments=' + metrics.payments,
        'calculations=' + metrics.calculations,
        'statements=' + metrics.statements,
        'pendingApprovals=' + metrics.pendingApprovals,
        'stalePendingApprovals=' + metrics.stalePendingApprovals,
        'unresolvedExceptions=' + metrics.unresolvedExceptions,
        'orphanedLockedCalculations=' + metrics.orphanedLockedCalculations,
        'warnings=' + warnings.length,
        'errors=' + errors.length
    ].join(' | ');

    if (warnings.length > 0) {
        details += ' | warningDetails=' + warnings.join(' || ');
    }
    if (errors.length > 0) {
        details += ' | errorDetails=' + errors.join(' || ');
    }

    createReconciliationLog({
        reconciliation_date: finishedAt.getDisplayValue(),
        records_checked: metrics.wonDeals + metrics.payments + metrics.calculations + metrics.statements,
        total_variances: warnings.length + errors.length,
        significant_variances: errors.length,
        errors_found: errors.length,
        warnings_found: warnings.length,
        status: status,
        processing_time_seconds: processingSeconds,
        details: details
    });

    if (errors.length > 0) {
        createSystemAlert('Month-End Readiness Audit Failed', details, 'high');
        gs.error('Commission Management: ' + details);
    } else if (warnings.length > 0) {
        createSystemAlert('Month-End Readiness Audit Warning', details, 'medium');
        gs.warn('Commission Management: ' + details);
    } else {
        gs.info('Commission Management: ' + details);
    }

    return {
        status: status,
        targetYear: target.year,
        targetMonth: target.month,
        metrics: metrics,
        warnings: warnings,
        errors: errors
    };
}

function resolveTargetPeriod() {
    var overrideYear = parseInt(gs.getProperty('x_823178_commissio.audit_target_year', ''), 10);
    var overrideMonth = parseInt(gs.getProperty('x_823178_commissio.audit_target_month', ''), 10);

    if (!isNaN(overrideYear) && !isNaN(overrideMonth) && overrideMonth >= 1 && overrideMonth <= 12) {
        return { year: overrideYear, month: overrideMonth };
    }

    var now = new GlideDateTime();
    var year = parseInt(now.getYearLocalTime(), 10);
    var month = parseInt(now.getMonthLocalTime(), 10) + 1;

    month--;
    if (month === 0) {
        month = 12;
        year--;
    }

    return { year: year, month: month };
}

function countStatementsForPeriod(year, month) {
    return countByQuery('x_823178_commissio_commission_statements', 'statement_year=' + year + '^statement_month=' + month);
}

function countByDateRange(table, dateField, startDate, endDate, extraQuery) {
    var encoded = dateField + '>=' + startDate + '^' + dateField + '<=' + endDate;
    if (extraQuery) {
        encoded += '^' + extraQuery;
    }
    return countByQuery(table, encoded);
}

function countByQuery(table, encodedQuery) {
    var agg = new GlideAggregate(table);
    if (encodedQuery) {
        agg.addEncodedQuery(encodedQuery);
    }
    agg.addAggregate('COUNT');
    agg.query();
    if (agg.next()) {
        return parseInt(agg.getAggregate('COUNT'), 10) || 0;
    }
    return 0;
}

function countStalePendingApprovals() {
    var now = new GlideDateTime().getDisplayValue();
    return countByQuery(
        'x_823178_commissio_statement_approvals',
        'statusINsubmitted,in_review^sla_due_onISNOTEMPTY^sla_due_on<' + now
    );
}

function daysInMonth(year, month) {
    if (month === 2) {
        var isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        return isLeap ? 29 : 28;
    }

    if (month === 4 || month === 6 || month === 9 || month === 11) {
        return 30;
    }

    return 31;
}

function pad2(value) {
    var v = parseInt(value, 10);
    return v < 10 ? '0' + v : String(v);
}
`,
        upgrade_safe: 'false',
    },
})
