import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide'
import { createSystemAlert } from '../script-includes/ops-governance-utils.js'

export function reconcileSeedGovernance() {
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
        errors: 0
    };

    gs.info('Commission Management: Seed governance reconciliation started. mode=' + mode + ', navSeedEnabled=' + navSeedEnabled + ', demoSeedEnabled=' + demoSeedEnabled);

    try {
        var enforceNavCleanup = mode === 'strict' || navSeedEnabled === false;
        var enforceDemoCleanup = mode === 'strict' || demoSeedEnabled === false;

        reconcileAppModules(results, enforceNavCleanup);
        reconcileDemoConfiguration(results, enforceDemoCleanup);

        var summary = 'Seed governance reconciliation completed. ' +
            'moduleDuplicatesFound=' + results.appModuleDuplicatesFound +
            ', moduleDuplicatesRemoved=' + results.appModuleDuplicatesRemoved +
            ', demoDuplicatesFound=' + results.demoConfigDuplicatesFound +
            ', demoDuplicatesRemoved=' + results.demoConfigDuplicatesRemoved +
            ', errors=' + results.errors;

        if (results.errors > 0) {
            gs.error('Commission Management: ' + summary);
            createSystemAlert('Seed Governance Reconciliation Errors', summary, 'high');
            return;
        }

        if (results.appModuleDuplicatesFound > 0 || results.demoConfigDuplicatesFound > 0) {
            gs.warn('Commission Management: ' + summary);
            createSystemAlert('Seed Governance Reconciliation Completed', summary, 'medium');
        } else {
            gs.info('Commission Management: ' + summary);
        }
    } catch (e) {
        gs.error('Commission Management: Seed governance reconciliation failed - ' + e.message);
        createSystemAlert('Seed Governance Reconciliation Failed', e.message, 'high');
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
}

function reconcileDemoConfiguration(results, enforceCleanup) {
    var sets = [
        {
            table: 'x_823178_commissio_plan_targets',
            fields: ['commission_plan', 'deal_type', 'annual_target_amount', 'description'],
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
