import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['76aff5568c82471e90571b87cee89fb2'],
    table: 'sysauto_script',
    data: {
        active: 'false',
        advanced: 'false',
        conditional: 'false',
        name: 'Commission Referential Integrity Audit',
        run_time: '2026-03-06 03:11:31',
        run_type: 'on_demand',
        script: `import { gs, GlideRecord } from '@servicenow/glide'

export function backfillDealTypeReferences() {
    var results = {
        mode: 'strict_referential_audit',
        requiredRefMissing: 0,
        requiredRefInactiveOrMissing: 0,
        tierPlanTargetMissing: 0,
        tierPlanTargetInvalid: 0,
        tierTargetDealTypeMissing: 0,
        tierTargetDealTypeInactiveOrMissing: 0,
        bonusRefInactiveOrMissing: 0,
        errors: 0
    }

    try {
        var activeTypeIds = loadActiveDealTypeIds()

        auditRequiredReference('x_823178_commissio_deals', 'deal_type_ref', activeTypeIds, results)
        auditRequiredReference('x_823178_commissio_plan_targets', 'deal_type_ref', activeTypeIds, results)
        auditRequiredReference('x_823178_commissio_deal_classifications', 'deal_type_ref', activeTypeIds, results)
        auditRequiredReference('x_823178_commissio_commission_calculations', 'deal_type_ref', activeTypeIds, results)

        auditTierTargetHierarchy(activeTypeIds, results)
        auditOptionalBonusReference(activeTypeIds, results)

        gs.info('Commission Management: Strict deal-type hierarchy audit completed: ' + JSON.stringify(results))
    } catch (e) {
        results.errors++
        gs.error('Commission Management: Strict deal-type hierarchy audit failed - ' + e.message)
    }
}

function loadActiveDealTypeIds() {
    var set = {}
    var typeGr = new GlideRecord('x_823178_commissio_deal_types')
    typeGr.addQuery('is_active', true)
    typeGr.query()

    while (typeGr.next()) {
        set[typeGr.getUniqueValue()] = true
    }

    return set
}

function auditRequiredReference(table, refField, activeTypeIds, results) {
    var gr = new GlideRecord(table)
    gr.query()

    while (gr.next()) {
        var refId = (gr.getValue(refField) || '').toString()
        if (!refId) {
            results.requiredRefMissing++
            continue
        }

        if (!activeTypeIds[refId]) {
            results.requiredRefInactiveOrMissing++
        }
    }
}

function auditTierTargetHierarchy(activeTypeIds, results) {
    var tierGr = new GlideRecord('x_823178_commissio_plan_tiers')
    tierGr.query()

    while (tierGr.next()) {
        var targetId = (tierGr.getValue('plan_target') || '').toString()
        if (!targetId) {
            results.tierPlanTargetMissing++
            continue
        }

        var targetGr = new GlideRecord('x_823178_commissio_plan_targets')
        if (!targetGr.get(targetId)) {
            results.tierPlanTargetInvalid++
            continue
        }

        var targetTypeRef = (targetGr.getValue('deal_type_ref') || '').toString()
        if (!targetTypeRef) {
            results.tierTargetDealTypeMissing++
            continue
        }

        if (!activeTypeIds[targetTypeRef]) {
            results.tierTargetDealTypeInactiveOrMissing++
        }
    }
}

function auditOptionalBonusReference(activeTypeIds, results) {
    var bonusGr = new GlideRecord('x_823178_commissio_plan_bonuses')
    bonusGr.query()

    while (bonusGr.next()) {
        var refId = (bonusGr.getValue('deal_type_ref') || '').toString()
        if (!refId) {
            continue
        }

        if (!activeTypeIds[refId]) {
            results.bonusRefInactiveOrMissing++
        }
    }
}
`,
        upgrade_safe: 'false',
    },
})
