import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['e1b0d2b47abe4737bb98d3498b058b99'],
    table: 'sysauto_script',
    data: {
        active: 'false',
        advanced: 'false',
        conditional: 'false',
        name: 'Commission Referential Tier and Classification Maintenance',
        run_time: '2026-03-06 03:47:29',
        run_type: 'on_demand',
        script: `import { gs, GlideRecord } from '@servicenow/glide'

export function backfillTierAndDealClassifications() {
    var results = {
        mode: 'strict_referential_maintenance',
        dealsProcessed: 0,
        classificationsInserted: 0,
        classificationsUpdated: 0,
        tiersProcessed: 0,
        tierCeilingsBackfilled: 0,
        tierRowsMissingPlanTarget: 0,
        errors: 0
    }

    try {
        ensureDealPrimaryClassification(results)
        backfillTierCeilingsByTarget(results)
        gs.info('Commission Management: Strict tier/classification maintenance completed: ' + JSON.stringify(results))
    } catch (e) {
        results.errors++
        gs.error('Commission Management: Strict tier/classification maintenance failed - ' + e.message)
    }
}

function ensureDealPrimaryClassification(results) {
    var dealGr = new GlideRecord('x_823178_commissio_deals')
    dealGr.query()

    while (dealGr.next()) {
        results.dealsProcessed++

        var dealId = dealGr.getUniqueValue()
        var dealTypeRef = (dealGr.getValue('deal_type_ref') || '').toString()
        if (!dealTypeRef) {
            continue
        }

        var classRows = loadDealClassifications(dealId)
        if (classRows.length === 0) {
            var insertGr = new GlideRecord('x_823178_commissio_deal_classifications')
            insertGr.initialize()
            insertGr.setValue('deal', dealId)
            insertGr.setValue('deal_type_ref', dealTypeRef)
            insertGr.setValue('priority', 10)
            insertGr.setValue('is_primary', true)
            insertGr.setValue('is_active', true)
            insertGr.setValue('source', 'backfill')
            insertGr.insert()
            results.classificationsInserted++
            continue
        }

        var hasPrimary = false
        var primaryRow = null
        for (var i = 0; i < classRows.length; i++) {
            var row = classRows[i]
            if (row.isPrimary) {
                hasPrimary = true
                if (!primaryRow) {
                    primaryRow = row
                }
            }
        }

        if (!hasPrimary) {
            var promoteRow = classRows[0]
            var promoteGr = new GlideRecord('x_823178_commissio_deal_classifications')
            if (promoteGr.get(promoteRow.sysId)) {
                promoteGr.setValue('is_primary', true)
                promoteGr.setValue('is_active', true)
                if (!promoteGr.getValue('priority')) {
                    promoteGr.setValue('priority', 10)
                }
                promoteGr.update()
                results.classificationsUpdated++
            }
            primaryRow = promoteRow
        }

        if (primaryRow && primaryRow.dealTypeRef !== dealTypeRef) {
            var syncPrimaryGr = new GlideRecord('x_823178_commissio_deal_classifications')
            if (syncPrimaryGr.get(primaryRow.sysId)) {
                syncPrimaryGr.setValue('deal_type_ref', dealTypeRef)
                syncPrimaryGr.setValue('is_active', true)
                syncPrimaryGr.update()
                results.classificationsUpdated++
            }
        }
    }
}

function loadDealClassifications(dealId) {
    var rows = []
    var classGr = new GlideRecord('x_823178_commissio_deal_classifications')
    classGr.addQuery('deal', dealId)
    classGr.orderBy('priority')
    classGr.orderBy('sys_created_on')
    classGr.query()

    while (classGr.next()) {
        rows.push({
            sysId: classGr.getUniqueValue(),
            dealTypeRef: (classGr.getValue('deal_type_ref') || '').toString(),
            isPrimary: classGr.getValue('is_primary') === 'true' || classGr.getValue('is_primary') === true
        })
    }

    return rows
}

function backfillTierCeilingsByTarget(results) {
    var targetIds = []
    var seen = {}

    var tierTargetGr = new GlideRecord('x_823178_commissio_plan_tiers')
    tierTargetGr.addQuery('is_active', true)
    tierTargetGr.query()

    while (tierTargetGr.next()) {
        var targetId = (tierTargetGr.getValue('plan_target') || '').toString()
        if (!targetId) {
            results.tierRowsMissingPlanTarget++
            continue
        }
        if (!seen[targetId]) {
            seen[targetId] = true
            targetIds.push(targetId)
        }
    }

    for (var i = 0; i < targetIds.length; i++) {
        backfillTargetTierBand(targetIds[i], results)
    }
}

function backfillTargetTierBand(planTargetId, results) {
    var tiers = []

    var tierGr = new GlideRecord('x_823178_commissio_plan_tiers')
    tierGr.addQuery('plan_target', planTargetId)
    tierGr.addQuery('is_active', true)
    tierGr.orderBy('attainment_floor_percent')
    tierGr.query()

    while (tierGr.next()) {
        tiers.push({
            sysId: tierGr.getUniqueValue(),
            floor: parseFloat(tierGr.getValue('attainment_floor_percent')) || 0,
            ceiling: parseFloat(tierGr.getValue('attainment_ceiling_percent'))
        })
    }

    tiers.sort(function(a, b) {
        return a.floor - b.floor
    })

    for (var t = 0; t < tiers.length; t++) {
        results.tiersProcessed++

        var tier = tiers[t]
        var nextTier = t + 1 < tiers.length ? tiers[t + 1] : null
        var resolvedCeiling = !isNaN(tier.ceiling) && tier.ceiling > tier.floor ? tier.ceiling : null

        if (!resolvedCeiling) {
            if (nextTier && nextTier.floor > tier.floor) {
                resolvedCeiling = nextTier.floor
            } else {
                resolvedCeiling = 999999
            }
        }

        var updateGr = new GlideRecord('x_823178_commissio_plan_tiers')
        if (!updateGr.get(tier.sysId)) {
            continue
        }

        var currentCeiling = parseFloat(updateGr.getValue('attainment_ceiling_percent'))
        if (isNaN(currentCeiling) || currentCeiling <= tier.floor) {
            updateGr.setValue('attainment_ceiling_percent', resolvedCeiling)
            updateGr.update()
            results.tierCeilingsBackfilled++
        }
    }
}
`,
        upgrade_safe: 'false',
    },
})
