import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide'
import { createSystemAlert, createReconciliationLog } from '../script-includes/ops-governance-utils.js'

export function reconcileSeedGovernance() {
    var startedAt = new GlideDateTime();
    var mode = (gs.getProperty('x_823178_commissio.seed_idempotency_mode', 'strict') || 'strict').toLowerCase();
    var navSeedEnabled = toBool(gs.getProperty('x_823178_commissio.seed_navigation_enabled', 'false'));
    var demoSeedEnabled = toBool(gs.getProperty('x_823178_commissio.seed_demo_data_enabled', 'false'));

    var results = {
        mode: mode,
        navSeedEnabled: navSeedEnabled,
        demoSeedEnabled: demoSeedEnabled,
        appModuleDuplicatesFound: 0,
        appModuleDuplicatesRemoved: 0,
        demoConfigDuplicatesFound: 0,
        demoConfigDuplicatesRemoved: 0,
        recordsChecked: 0,
        warnings: 0,
        errors: 0,
        moduleRowsChecked: 0,
        appModuleTotal: 0,
        appModuleActive: 0,
        appModuleUniqueSignatures: 0
    };

    gs.info('Commission Management: Seed governance reconciliation started. mode=' + mode + ', navSeedEnabled=' + navSeedEnabled + ', demoSeedEnabled=' + demoSeedEnabled);

    try {
        var enforceNavCleanup = mode === 'strict' || navSeedEnabled === false;
        var enforceDemoCleanup = mode === 'strict' || demoSeedEnabled === false;

        reconcileAppModules(results, enforceNavCleanup);
        reconcileDemoConfiguration(results, enforceDemoCleanup);

        if (mode !== 'strict') {
            results.warnings++;
        }

        if (navSeedEnabled || demoSeedEnabled) {
            results.warnings++;
        }

        var summary = 'Seed governance reconciliation completed. ' +
            'moduleDuplicatesFound=' + results.appModuleDuplicatesFound +
            ', moduleDuplicatesRemoved=' + results.appModuleDuplicatesRemoved +
            ', demoDuplicatesFound=' + results.demoConfigDuplicatesFound +
            ', demoDuplicatesRemoved=' + results.demoConfigDuplicatesRemoved +
            ', errors=' + results.errors;

        writeOperationalEvidence(results, startedAt, summary);

        if (results.errors > 0) {
            gs.error('Commission Management: ' + summary);
            createSystemAlert('Seed Governance Reconciliation Errors', summary, 'high');
            return results;
        }

        if (results.appModuleDuplicatesFound > 0 || results.demoConfigDuplicatesFound > 0) {
            gs.warn('Commission Management: ' + summary);
            createSystemAlert('Seed Governance Reconciliation Completed', summary, 'medium');
        } else {
            gs.info('Commission Management: ' + summary);
        }

        return results;
    } catch (e) {
        gs.error('Commission Management: Seed governance reconciliation failed - ' + e.message);
        createSystemAlert('Seed Governance Reconciliation Failed', e.message, 'high');
        results.errors++;
        writeOperationalEvidence(results, startedAt, 'Seed governance reconciliation failed: ' + e.message);
        return results;
    }
}

function reconcileAppModules(results, enforceCleanup) {
    var appId = getCommissionApplicationId();
    if (!appId) {
        results.errors++;
        gs.error('Commission Management: Unable to locate Commission Management application for module reconciliation');
        return;
    }

    var signatures = {};
    var moduleGr = new GlideRecord('sys_app_module');
    moduleGr.addQuery('application', appId);
    moduleGr.orderBy('sys_created_on');
    moduleGr.query();

    while (moduleGr.next()) {
        results.moduleRowsChecked++;
        results.recordsChecked++;

        if (toBool(moduleGr.getValue('active'))) {
            results.appModuleActive++;
        }

        var signature = [
            (moduleGr.getValue('title') || '').toString(),
            (moduleGr.getValue('link_type') || '').toString(),
            (moduleGr.getValue('name') || '').toString(),
            (moduleGr.getValue('query') || '').toString()
        ].join('|');

        if (!signatures[signature]) {
            signatures[signature] = moduleGr.getUniqueValue();
            continue;
        }

        results.appModuleDuplicatesFound++;
        if (enforceCleanup) {
            moduleGr.deleteRecord();
            results.appModuleDuplicatesRemoved++;
        }
    }

    results.appModuleUniqueSignatures = Object.keys(signatures).length;
    results.appModuleTotal = results.moduleRowsChecked;
}

function reconcileDemoConfiguration(results, enforceCleanup) {
    var sets = [
        {
            table: 'x_823178_commissio_plan_targets',
            fields: ['commission_plan', 'deal_type_ref', 'annual_target_amount', 'description'],
            encodedQuery: 'descriptionCONTAINSquota'
        },
        {
            table: 'x_823178_commissio_plan_tiers',
            fields: ['commission_plan', 'tier_name', 'attainment_floor_percent', 'commission_rate_percent', 'description'],
            encodedQuery: 'descriptionCONTAINSrate'
        },
        {
            table: 'x_823178_commissio_plan_bonuses',
            fields: ['commission_plan', 'bonus_name', 'bonus_amount', 'bonus_trigger', 'description'],
            encodedQuery: 'descriptionCONTAINSAuto-earned^ORdescriptionCONTAINSperformance'
        }
    ];

    for (var i = 0; i < sets.length; i++) {
        dedupeBySignature(results, sets[i].table, sets[i].fields, sets[i].encodedQuery, enforceCleanup);
    }
}

function dedupeBySignature(results, table, fields, encodedQuery, enforceCleanup) {
    var signatures = {};
    var gr = new GlideRecord(table);
    if (encodedQuery) {
        gr.addEncodedQuery(encodedQuery);
    }
    gr.orderBy('sys_created_on');
    gr.query();

    while (gr.next()) {
        results.recordsChecked++;
        var signatureParts = [];
        for (var i = 0; i < fields.length; i++) {
            signatureParts.push((gr.getValue(fields[i]) || '').toString());
        }
        var signature = signatureParts.join('|');

        if (!signatures[signature]) {
            signatures[signature] = gr.getUniqueValue();
            continue;
        }

        results.demoConfigDuplicatesFound++;
        if (enforceCleanup) {
            gr.deleteRecord();
            results.demoConfigDuplicatesRemoved++;
        }
    }
}

function writeOperationalEvidence(results, startedAt, summary) {
    var finishedAt = new GlideDateTime();
    var elapsedMs = finishedAt.getNumericValue() - startedAt.getNumericValue();
    var processingSeconds = elapsedMs > 0 ? Math.round(elapsedMs / 1000) : 0;

    var status = 'passed';
    if (results.errors > 0) {
        status = 'failed';
    } else if (results.warnings > 0 || results.appModuleDuplicatesFound > 0 || results.demoConfigDuplicatesFound > 0) {
        status = 'warning';
    }

    var details = [
        summary,
        'mode=' + results.mode,
        'navSeedEnabled=' + results.navSeedEnabled,
        'demoSeedEnabled=' + results.demoSeedEnabled,
        'appModuleTotal=' + results.appModuleTotal,
        'appModuleActive=' + results.appModuleActive,
        'appModuleUniqueSignatures=' + results.appModuleUniqueSignatures,
        'recordsChecked=' + results.recordsChecked,
        'warnings=' + results.warnings,
        'errors=' + results.errors
    ].join(' | ');

    createReconciliationLog({
        reconciliation_date: finishedAt.getDisplayValue(),
        records_checked: results.recordsChecked,
        total_variances: results.appModuleDuplicatesFound + results.demoConfigDuplicatesFound,
        significant_variances: results.appModuleDuplicatesFound,
        errors_found: results.errors,
        warnings_found: results.warnings,
        status: status,
        processing_time_seconds: processingSeconds,
        details: details
    });
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
