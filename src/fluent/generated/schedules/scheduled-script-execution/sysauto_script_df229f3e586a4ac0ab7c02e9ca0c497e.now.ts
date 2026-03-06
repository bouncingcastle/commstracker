import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['df229f3e586a4ac0ab7c02e9ca0c497e'],
    table: 'sysauto_script',
    data: {
        active: 'false',
        advanced: 'false',
        conditional: 'false',
        name: 'Commission Architecture Integrity Check',
        run_time: '2026-03-06 02:34:40',
        run_type: 'daily',
        script: `import { gs, GlideRecord, GlideAggregate, GlideDateTime } from '@servicenow/glide'
import { createSystemAlert, createReconciliationLog } from '../script-includes/ops-governance-utils.js'

export function runArchitectureIntegrityCheck() {
    var startedAt = new GlideDateTime();
    var missing = [];
    var warnings = [];
    var recordsChecked = 0;

    var appId = getCommissionApplicationId();
    if (!appId) {
        missing.push('sys_app_application: Commission Management');
    }
    recordsChecked++;

    var requiredTables = [
        'x_823178_commissio_commission_plans',
        'x_823178_commissio_plan_targets',
        'x_823178_commissio_plan_tiers',
        'x_823178_commissio_plan_bonuses',
        'x_823178_commissio_deals',
        'x_823178_commissio_commission_calculations',
        'x_823178_commissio_commission_statements',
        'x_823178_commissio_statement_approvals',
        'x_823178_commissio_reconciliation_log',
        'x_823178_commissio_system_alerts'
    ];

    var requiredRoles = [
        'x_823178_commissio.admin',
        'x_823178_commissio.manager',
        'x_823178_commissio.finance',
        'x_823178_commissio.rep'
    ];

    var requiredProperties = [
        'x_823178_commissio.seed_idempotency_mode',
        'x_823178_commissio.seed_navigation_enabled',
        'x_823178_commissio.seed_demo_data_enabled',
        'x_823178_commissio.statement_approval_sla_hours',
        'x_823178_commissio.audit_target_year',
        'x_823178_commissio.audit_target_month'
    ];

    var requiredJobs = [
        'Commission Seed Governance Reconciliation',
        'Commission Production MVP Readiness Check',
        'Commission Month-End Readiness Audit'
    ];

    var requiredModules = [
        { title: 'Dashboard', query: 'x_823178_commissio_dashboard.do' },
        { title: 'My Progress', query: 'x_823178_commissio_progress.do' }
    ];

    recordsChecked += validateNamedRecords('sys_db_object', 'name', requiredTables, 'table', missing);
    recordsChecked += validateNamedRecords('sys_user_role', 'name', requiredRoles, 'role', missing);
    recordsChecked += validateNamedRecords('sys_properties', 'name', requiredProperties, 'property', missing);
    recordsChecked += validateNamedRecords('sysauto_script', 'name', requiredJobs, 'job', missing);

    recordsChecked += validateModuleRecords(appId, requiredModules, missing);

    var strictMode = (gs.getProperty('x_823178_commissio.seed_idempotency_mode', 'strict') || 'strict').toLowerCase();
    var navSeedEnabled = toBool(gs.getProperty('x_823178_commissio.seed_navigation_enabled', 'false'));
    var demoSeedEnabled = toBool(gs.getProperty('x_823178_commissio.seed_demo_data_enabled', 'false'));
    recordsChecked += 3;

    if (strictMode !== 'strict') {
        warnings.push('seed_idempotency_mode is ' + strictMode + ' (expected strict).');
    }
    if (navSeedEnabled) {
        warnings.push('seed_navigation_enabled is true (expected false outside controlled windows).');
    }
    if (demoSeedEnabled) {
        warnings.push('seed_demo_data_enabled is true (expected false outside controlled windows).');
    }

    var finishedAt = new GlideDateTime();
    var elapsedMs = finishedAt.getNumericValue() - startedAt.getNumericValue();
    var processingSeconds = elapsedMs > 0 ? Math.round(elapsedMs / 1000) : 0;

    var status = 'passed';
    if (missing.length > 0) {
        status = 'failed';
    } else if (warnings.length > 0) {
        status = 'warning';
    }

    var details = [
        'Architecture integrity check',
        'recordsChecked=' + recordsChecked,
        'missing=' + missing.length,
        'warnings=' + warnings.length,
        'seedMode=' + strictMode,
        'seedNavigationEnabled=' + navSeedEnabled,
        'seedDemoEnabled=' + demoSeedEnabled
    ].join(' | ');

    if (missing.length > 0) {
        details += ' | missingDetails=' + missing.join(' || ');
    }
    if (warnings.length > 0) {
        details += ' | warningDetails=' + warnings.join(' || ');
    }

    createReconciliationLog({
        reconciliation_date: finishedAt.getDisplayValue(),
        records_checked: recordsChecked,
        total_variances: missing.length + warnings.length,
        significant_variances: missing.length,
        errors_found: missing.length,
        warnings_found: warnings.length,
        status: status,
        processing_time_seconds: processingSeconds,
        details: details
    });

    if (status === 'failed') {
        createSystemAlert('Architecture Integrity Check Failed', details, 'high');
        gs.error('Commission Management: ' + details);
    } else if (status === 'warning') {
        createSystemAlert('Architecture Integrity Check Warning', details, 'medium');
        gs.warn('Commission Management: ' + details);
    } else {
        gs.info('Commission Management: ' + details);
    }

    return {
        status: status,
        recordsChecked: recordsChecked,
        missing: missing,
        warnings: warnings
    };
}

function validateNamedRecords(table, field, expectedValues, label, missing) {
    var checked = 0;

    for (var i = 0; i < expectedValues.length; i++) {
        checked++;

        var gr = new GlideRecord(table);
        gr.addQuery(field, expectedValues[i]);
        gr.setLimit(1);
        gr.query();

        if (!gr.next()) {
            missing.push(label + ': ' + expectedValues[i]);
        }
    }

    return checked;
}

function validateModuleRecords(appId, requiredModules, missing) {
    var checked = 0;

    for (var i = 0; i < requiredModules.length; i++) {
        checked++;

        var moduleGr = new GlideRecord('sys_app_module');
        if (appId) {
            moduleGr.addQuery('application', appId);
        }
        moduleGr.addQuery('title', requiredModules[i].title);
        moduleGr.addQuery('query', requiredModules[i].query);
        moduleGr.addQuery('active', true);
        moduleGr.setLimit(1);
        moduleGr.query();

        if (!moduleGr.next()) {
            missing.push('module: ' + requiredModules[i].title + ' (' + requiredModules[i].query + ')');
        }
    }

    return checked;
}

function getCommissionApplicationId() {
    var appGr = new GlideRecord('sys_app_application');
    appGr.addQuery('title', 'Commission Management');
    appGr.orderByDesc('sys_created_on');
    appGr.setLimit(1);
    appGr.query();

    if (appGr.next()) {
        return appGr.getUniqueValue();
    }

    return '';
}

function toBool(value) {
    return value === true || value === 'true' || value === '1' || value === 1;
}
`,
        upgrade_safe: 'false',
    },
})
