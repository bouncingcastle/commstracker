import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['9ec29b9ed2dc4669b47f21f09aa42875'],
    table: 'sysauto_script',
    data: {
        active: 'false',
        advanced: 'false',
        conditional: 'false',
        name: 'Commission Production MVP Readiness Check',
        run_time: '2026-03-05 21:25:48',
        run_type: 'daily',
        script: `import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide'
import { createSystemAlert, createReconciliationLog } from '../script-includes/ops-governance-utils.js'

export function runProductionMvpReadinessCheck() {
    var startedAt = new GlideDateTime();
    var warnings = [];
    var errors = [];
    var recordsChecked = 0;

    try {
        var appId = getCommissionAppId();
        if (!appId) {
            errors.push('Commission Management application record not found.');
        }

        var requiredModules = [
            { title: 'Dashboard', query: 'x_823178_commissio_dashboard.do' },
            { title: 'My Progress', query: 'x_823178_commissio_progress.do' }
        ];

        for (var i = 0; i < requiredModules.length; i++) {
            var moduleCheck = findModule(appId, requiredModules[i].title, requiredModules[i].query);
            recordsChecked += moduleCheck.checked;
            if (!moduleCheck.found) {
                errors.push('Missing required module: ' + requiredModules[i].title + ' (' + requiredModules[i].query + ')');
            }
        }

        var mode = (gs.getProperty('x_823178_commissio.seed_idempotency_mode', 'strict') || 'strict').toLowerCase();
        var navSeedEnabled = toBool(gs.getProperty('x_823178_commissio.seed_navigation_enabled', 'false'));
        var demoSeedEnabled = toBool(gs.getProperty('x_823178_commissio.seed_demo_data_enabled', 'false'));
        recordsChecked += 3;

        if (mode !== 'strict') {
            warnings.push('Seed idempotency mode is not strict (' + mode + ').');
        }
        if (navSeedEnabled) {
            warnings.push('Navigation seed is enabled; keep disabled outside controlled windows.');
        }
        if (demoSeedEnabled) {
            warnings.push('Demo data seed is enabled; keep disabled outside controlled windows.');
        }

        var roleChecks = [
            'x_823178_commissio.admin',
            'x_823178_commissio.manager',
            'x_823178_commissio.finance',
            'x_823178_commissio.rep'
        ];

        for (var r = 0; r < roleChecks.length; r++) {
            recordsChecked++;
            if (!roleExists(roleChecks[r])) {
                errors.push('Missing required role: ' + roleChecks[r]);
            }
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

        var detailParts = [
            'Production MVP readiness check',
            'mode=' + mode,
            'navSeedEnabled=' + navSeedEnabled,
            'demoSeedEnabled=' + demoSeedEnabled,
            'warnings=' + warnings.length,
            'errors=' + errors.length,
            'recordsChecked=' + recordsChecked
        ];

        if (warnings.length > 0) {
            detailParts.push('warningDetails=' + warnings.join(' || '));
        }
        if (errors.length > 0) {
            detailParts.push('errorDetails=' + errors.join(' || '));
        }

        var details = detailParts.join(' | ');

        createReconciliationLog({
            reconciliation_date: finishedAt.getDisplayValue(),
            records_checked: recordsChecked,
            total_variances: warnings.length + errors.length,
            significant_variances: errors.length,
            errors_found: errors.length,
            warnings_found: warnings.length,
            status: status,
            processing_time_seconds: processingSeconds,
            details: details
        });

        if (errors.length > 0) {
            createSystemAlert('Production MVP Readiness Check Failed', details, 'high');
            gs.error('Commission Management: ' + details);
        } else if (warnings.length > 0) {
            createSystemAlert('Production MVP Readiness Check Warning', details, 'medium');
            gs.warn('Commission Management: ' + details);
        } else {
            gs.info('Commission Management: ' + details);
        }

        return {
            status: status,
            warnings: warnings,
            errors: errors,
            recordsChecked: recordsChecked
        };
    } catch (e) {
        var failure = 'Production MVP readiness check failed: ' + e.message;
        createSystemAlert('Production MVP Readiness Check Failed', failure, 'high');
        createReconciliationLog({
            reconciliation_date: new GlideDateTime().getDisplayValue(),
            records_checked: recordsChecked,
            total_variances: 1,
            significant_variances: 1,
            errors_found: 1,
            warnings_found: 0,
            status: 'failed',
            processing_time_seconds: 0,
            details: failure
        });
        gs.error('Commission Management: ' + failure);
        return {
            status: 'failed',
            warnings: [],
            errors: [failure],
            recordsChecked: recordsChecked
        };
    }
}

function getCommissionAppId() {
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

function findModule(appId, title, query) {
    var checked = 0;

    if (!appId) {
        return { found: false, checked: 0 };
    }

    var moduleGr = new GlideRecord('sys_app_module');
    moduleGr.addQuery('application', appId);
    moduleGr.addQuery('title', title);
    moduleGr.addQuery('query', query);
    moduleGr.addQuery('active', true);
    moduleGr.setLimit(1);
    moduleGr.query();
    checked++;

    return {
        found: moduleGr.next(),
        checked: checked
    };
}

function roleExists(roleName) {
    var roleGr = new GlideRecord('sys_user_role');
    roleGr.addQuery('name', roleName);
    roleGr.setLimit(1);
    roleGr.query();
    return roleGr.next();
}

function toBool(value) {
    return value === true || value === 'true' || value === '1' || value === 1;
}
`,
        upgrade_safe: 'false',
    },
})
