import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: 'legacy_deal_type_cutover_remediation_job',
    table: 'sysauto_script',
    data: {
        name: 'Commission Legacy Deal Type Cutover Remediation',
        script: `(function executeLegacyDealTypeCutoverRemediation() {
    var dryRun = toBool(gs.getProperty('x_823178_commissio.legacy_cutover_dry_run', 'true'));
    var maxRowsPerTable = toPositiveInt(gs.getProperty('x_823178_commissio.legacy_cutover_max_rows_per_table', '20000'), 20000);
    var sampleLimit = toPositiveInt(gs.getProperty('x_823178_commissio.legacy_cutover_sample_limit', '25'), 25);

    var results = {
        mode: dryRun ? 'dry_run' : 'apply',
        started_at: new GlideDateTime().getDisplayValue(),
        max_rows_per_table: maxRowsPerTable,
        scanned: 0,
        changed: 0,
        updated: 0,
        dry_run_updates: 0,
        mapped_from_legacy: 0,
        remapped_from_inactive_ref: 0,
        invalid_ref_cleared_optional: 0,
        legacy_value_cleared: 0,
        unresolved_missing_required_ref: 0,
        unresolved_unmapped_legacy: 0,
        table_summaries: [],
        unresolved_samples: [],
        errors: 0
    };

    try {
        var catalog = loadDealTypeCatalog();

        processReferentialTable({
            table: 'x_823178_commissio_deals',
            refField: 'deal_type_ref',
            legacyField: 'deal_type',
            requiredRef: true,
            allowBlankScope: false
        }, catalog, dryRun, maxRowsPerTable, sampleLimit, results);

        processReferentialTable({
            table: 'x_823178_commissio_plan_targets',
            refField: 'deal_type_ref',
            legacyField: 'deal_type',
            requiredRef: true,
            allowBlankScope: false
        }, catalog, dryRun, maxRowsPerTable, sampleLimit, results);

        processReferentialTable({
            table: 'x_823178_commissio_commission_calculations',
            refField: 'deal_type_ref',
            legacyField: 'deal_type',
            requiredRef: true,
            allowBlankScope: false
        }, catalog, dryRun, maxRowsPerTable, sampleLimit, results);

        processReferentialTable({
            table: 'x_823178_commissio_deal_classifications',
            refField: 'deal_type_ref',
            legacyField: 'deal_type',
            requiredRef: true,
            allowBlankScope: false
        }, catalog, dryRun, maxRowsPerTable, sampleLimit, results);

        processReferentialTable({
            table: 'x_823178_commissio_plan_bonuses',
            refField: 'deal_type_ref',
            legacyField: 'deal_type',
            requiredRef: false,
            allowBlankScope: true
        }, catalog, dryRun, maxRowsPerTable, sampleLimit, results);

        clearLegacyOnlyField({
            table: 'x_823178_commissio_plan_tiers',
            legacyField: 'deal_type'
        }, dryRun, maxRowsPerTable, results);

        clearLegacyOnlyField({
            table: 'x_823178_commissio_commission_plans',
            legacyField: 'deal_type'
        }, dryRun, maxRowsPerTable, results);

        results.finished_at = new GlideDateTime().getDisplayValue();
        gs.info('Commission Management: Legacy deal-type cutover remediation completed: ' + JSON.stringify(results));
    } catch (e) {
        results.errors++;
        gs.error('Commission Management: Legacy deal-type cutover remediation failed - ' + e.message);
    }

    function processReferentialTable(config, catalog, dryRun, maxRowsPerTable, sampleLimit, results) {
        var summary = {
            table: config.table,
            scanned: 0,
            changed: 0,
            updated: 0,
            dry_run_updates: 0,
            mapped_from_legacy: 0,
            remapped_from_inactive_ref: 0,
            invalid_ref_cleared_optional: 0,
            legacy_value_cleared: 0,
            unresolved_missing_required_ref: 0,
            unresolved_unmapped_legacy: 0,
            skipped: false
        };

        var gr = new GlideRecord(config.table);
        if (!isValidRecord(gr)) {
            summary.skipped = true;
            summary.skip_reason = 'table_not_found';
            results.table_summaries.push(summary);
            return;
        }

        var hasRefField = !!(config.refField && gr.isValidField(config.refField));
        var hasLegacyField = !!(config.legacyField && gr.isValidField(config.legacyField));
        if (!hasRefField) {
            summary.skipped = true;
            summary.skip_reason = 'missing_ref_field';
            results.table_summaries.push(summary);
            return;
        }

        gr.orderBy('sys_created_on');
        if (maxRowsPerTable > 0) {
            gr.setLimit(maxRowsPerTable);
        }
        gr.query();

        while (gr.next()) {
            summary.scanned++;
            results.scanned++;

            var currentRef = sanitize(gr.getValue(config.refField));
            var legacyRaw = hasLegacyField ? sanitize(gr.getValue(config.legacyField)) : '';

            var nextRef = currentRef;
            var hasChanges = false;
            var unresolved = false;

            if (currentRef) {
                if (!catalog.activeById[currentRef]) {
                    var remapRef = '';
                    var refMeta = catalog.byId[currentRef];
                    if (refMeta && refMeta.code) {
                        remapRef = catalog.activeByCode[refMeta.code] || '';
                    }
                    if (!remapRef && legacyRaw) {
                        remapRef = resolveRefFromLegacy(legacyRaw, catalog, config.allowBlankScope);
                    }

                    if (remapRef !== null && (remapRef || !config.requiredRef)) {
                        if (remapRef !== currentRef) {
                            nextRef = remapRef;
                            hasChanges = true;
                            if (remapRef) {
                                summary.remapped_from_inactive_ref++;
                                results.remapped_from_inactive_ref++;
                            } else {
                                summary.invalid_ref_cleared_optional++;
                                results.invalid_ref_cleared_optional++;
                            }
                        }
                    } else if (!config.requiredRef) {
                        if (currentRef !== '') {
                            nextRef = '';
                            hasChanges = true;
                            summary.invalid_ref_cleared_optional++;
                            results.invalid_ref_cleared_optional++;
                        }
                    } else {
                        unresolved = true;
                        summary.unresolved_missing_required_ref++;
                        results.unresolved_missing_required_ref++;
                        pushUnresolved(results, sampleLimit, {
                            table: config.table,
                            sys_id: gr.getUniqueValue(),
                            issue: 'inactive_or_missing_ref_without_mapping',
                            current_ref: currentRef,
                            legacy_value: legacyRaw
                        });
                    }
                }
            } else {
                if (legacyRaw) {
                    var mappedRef = resolveRefFromLegacy(legacyRaw, catalog, config.allowBlankScope);
                    if (mappedRef !== null && (mappedRef || !config.requiredRef)) {
                        if (mappedRef !== currentRef) {
                            nextRef = mappedRef;
                            hasChanges = true;
                        }
                        if (mappedRef) {
                            summary.mapped_from_legacy++;
                            results.mapped_from_legacy++;
                        }
                    } else {
                        unresolved = true;
                        summary.unresolved_unmapped_legacy++;
                        results.unresolved_unmapped_legacy++;
                        pushUnresolved(results, sampleLimit, {
                            table: config.table,
                            sys_id: gr.getUniqueValue(),
                            issue: 'legacy_value_unmapped',
                            legacy_value: legacyRaw
                        });
                    }
                } else if (config.requiredRef) {
                    unresolved = true;
                    summary.unresolved_missing_required_ref++;
                    results.unresolved_missing_required_ref++;
                    pushUnresolved(results, sampleLimit, {
                        table: config.table,
                        sys_id: gr.getUniqueValue(),
                        issue: 'missing_required_ref'
                    });
                }
            }

            if (hasChanges) {
                gr.setValue(config.refField, nextRef);
            }

            if (hasLegacyField && legacyRaw && !unresolved) {
                gr.setValue(config.legacyField, '');
                hasChanges = true;
                summary.legacy_value_cleared++;
                results.legacy_value_cleared++;
            }

            if (hasChanges) {
                summary.changed++;
                results.changed++;
                if (dryRun) {
                    summary.dry_run_updates++;
                    results.dry_run_updates++;
                } else {
                    try {
                        gr.update();
                        summary.updated++;
                        results.updated++;
                    } catch (updateErr) {
                        results.errors++;
                        pushUnresolved(results, sampleLimit, {
                            table: config.table,
                            sys_id: gr.getUniqueValue(),
                            issue: 'update_error',
                            message: updateErr.message
                        });
                    }
                }
            }
        }

        results.table_summaries.push(summary);
    }

    function clearLegacyOnlyField(config, dryRun, maxRowsPerTable, results) {
        var summary = {
            table: config.table,
            scanned: 0,
            changed: 0,
            updated: 0,
            dry_run_updates: 0,
            legacy_value_cleared: 0,
            skipped: false
        };

        var gr = new GlideRecord(config.table);
        if (!isValidRecord(gr)) {
            summary.skipped = true;
            summary.skip_reason = 'table_not_found';
            results.table_summaries.push(summary);
            return;
        }

        if (!gr.isValidField(config.legacyField)) {
            summary.skipped = true;
            summary.skip_reason = 'missing_legacy_field';
            results.table_summaries.push(summary);
            return;
        }

        gr.orderBy('sys_created_on');
        if (maxRowsPerTable > 0) {
            gr.setLimit(maxRowsPerTable);
        }
        gr.query();

        while (gr.next()) {
            summary.scanned++;
            results.scanned++;

            var legacyRaw = sanitize(gr.getValue(config.legacyField));
            if (!legacyRaw) {
                continue;
            }

            gr.setValue(config.legacyField, '');
            summary.changed++;
            summary.legacy_value_cleared++;
            results.changed++;
            results.legacy_value_cleared++;

            if (dryRun) {
                summary.dry_run_updates++;
                results.dry_run_updates++;
            } else {
                try {
                    gr.update();
                    summary.updated++;
                    results.updated++;
                } catch (updateErr) {
                    results.errors++;
                }
            }
        }

        results.table_summaries.push(summary);
    }

    function loadDealTypeCatalog() {
        var byId = {};
        var activeById = {};
        var activeByCode = {};

        var typeGr = new GlideRecord('x_823178_commissio_deal_types');
        typeGr.query();
        while (typeGr.next()) {
            var id = typeGr.getUniqueValue();
            var code = normalizeType(typeGr.getValue('code'));
            var active = toBool(typeGr.getValue('is_active'));

            byId[id] = {
                code: code,
                is_active: active
            };

            if (active) {
                activeById[id] = true;
                if (code && !activeByCode[code]) {
                    activeByCode[code] = id;
                }
            }
        }

        return {
            byId: byId,
            activeById: activeById,
            activeByCode: activeByCode
        };
    }

    function resolveRefFromLegacy(rawLegacy, catalog, allowBlankScope) {
        var normalized = normalizeType(rawLegacy);
        if (!normalized) {
            return null;
        }
        if (normalized === 'any' || normalized === 'all') {
            return allowBlankScope ? '' : null;
        }
        return catalog.activeByCode[normalized] || null;
    }

    function normalizeType(value) {
        var normalized = sanitize(value).toLowerCase();
        normalized = normalized.replace(/[\\s\\-]+/g, '_').replace(/__+/g, '_').replace(/^_+|_+$/g, '');
        if (!normalized) {
            return '';
        }
        var aliases = {
            seller_sourced: 'new_business',
            seller_sourced_deal: 'new_business',
            referral: 'renewal',
            referral_deal: 'renewal',
            referral_assigned: 'renewal',
            referral_deal_assigned: 'renewal'
        };
        return aliases[normalized] || normalized;
    }

    function pushUnresolved(results, sampleLimit, sample) {
        if (results.unresolved_samples.length >= sampleLimit) {
            return;
        }
        results.unresolved_samples.push(sample);
    }

    function sanitize(value) {
        return (value || '').toString().trim();
    }

    function toBool(value) {
        return value === true || value === 1 || value === '1' || String(value).toLowerCase() === 'true';
    }

    function toPositiveInt(raw, fallback) {
        var parsed = parseInt(raw, 10);
        if (isNaN(parsed) || parsed < 1) {
            return fallback;
        }
        return parsed;
    }

    function isValidRecord(gr) {
        try {
            return !!(gr && typeof gr.isValid === 'function' && gr.isValid());
        } catch (e) {
            return false;
        }
    }
})();`,
        active: false,
        run_type: 'on_demand',
        run_time: '00:00:00',
        description:
            'One-time strict-cutover remediation. Maps legacy deal_type strings to active deal_type_ref, clears deprecated deal_type values, and reports unresolved records. Controlled by x_823178_commissio.legacy_cutover_* properties.'
    }
})
