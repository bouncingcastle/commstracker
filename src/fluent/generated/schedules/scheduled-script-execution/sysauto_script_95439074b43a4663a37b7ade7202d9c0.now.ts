import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['95439074b43a4663a37b7ade7202d9c0'],
    table: 'sysauto_script',
    data: {
        active: 'false',
        advanced: 'false',
        conditional: 'false',
        name: 'Commission Backfill: Tier Bands and Deal Classifications',
        run_time: '2026-03-05 21:10:05',
        run_type: 'on_demand',
        script: `import { gs, GlideRecord } from '@servicenow/glide'
import { normalizeDealType as normalizeDealTypeCanonical } from '../script-includes/deal-type-normalizer.js'

export function backfillTierAndDealClassifications() {
    var results = {
        dealsProcessed: 0,
        classificationsInserted: 0,
        classificationsUpdated: 0,
        tiersProcessed: 0,
        tierCeilingsBackfilled: 0,
        tierDealTypesNormalized: 0,
        errors: 0
    }

    try {
        backfillDealClassifications(results)
        backfillTierCeilings(results)
        gs.info('Commission Management: Tier/classification backfill completed: ' + JSON.stringify(results))
    } catch (e) {
        results.errors++
        gs.error('Commission Management: Tier/classification backfill failed - ' + e.message)
    }
}

function backfillDealClassifications(results) {
    var dealGr = new GlideRecord('x_823178_commissio_deals')
    dealGr.query()

    while (dealGr.next()) {
        results.dealsProcessed++

        var candidates = parseCandidates(dealGr.getValue('deal_type'))
        if (!candidates.length) {
            continue
        }

        for (var i = 0; i < candidates.length; i++) {
            var code = candidates[i]
            var existing = new GlideRecord('x_823178_commissio_deal_classifications')
            existing.addQuery('deal', dealGr.getUniqueValue())
            existing.addQuery('deal_type', code)
            existing.setLimit(1)
            existing.query()

            if (existing.next()) {
                var updated = false
                if (existing.getValue('is_active') !== 'true') {
                    existing.setValue('is_active', true)
                    updated = true
                }
                if (parseInt(existing.getValue('priority') || '0', 10) !== (i + 1) * 10) {
                    existing.setValue('priority', (i + 1) * 10)
                    updated = true
                }
                if ((i === 0 && existing.getValue('is_primary') !== 'true') || (i !== 0 && existing.getValue('is_primary') === 'true')) {
                    existing.setValue('is_primary', i === 0)
                    updated = true
                }
                if (updated) {
                    existing.update()
                    results.classificationsUpdated++
                }
                continue
            }

            var classGr = new GlideRecord('x_823178_commissio_deal_classifications')
            classGr.initialize()
            classGr.setValue('deal', dealGr.getUniqueValue())
            classGr.setValue('deal_type', code)
            classGr.setValue('priority', (i + 1) * 10)
            classGr.setValue('is_primary', i === 0)
            classGr.setValue('is_active', true)
            classGr.setValue('source', 'backfill')
            classGr.insert()
            results.classificationsInserted++
        }
    }
}

function backfillTierCeilings(results) {
    var planScopeRows = []
    var aggGr = new GlideRecord('x_823178_commissio_plan_tiers')
    aggGr.addQuery('is_active', true)
    aggGr.query()

    var seen = {}
    while (aggGr.next()) {
        var planId = aggGr.getValue('commission_plan')
        var scope = normalizeDealType(aggGr.getValue('deal_type'), 'all')
        var key = planId + '|' + scope
        if (seen[key]) {
            continue
        }
        seen[key] = true
        planScopeRows.push({ planId: planId, scope: scope })
    }

    for (var i = 0; i < planScopeRows.length; i++) {
        var row = planScopeRows[i]
        var tiers = []
        var tierGr = new GlideRecord('x_823178_commissio_plan_tiers')
        tierGr.addQuery('commission_plan', row.planId)
        tierGr.addQuery('is_active', true)
        tierGr.orderBy('attainment_floor_percent')
        tierGr.query()

        while (tierGr.next()) {
            var normalizedScope = normalizeDealType(tierGr.getValue('deal_type'), 'all')
            if (!(normalizedScope === row.scope || normalizedScope === 'all' || row.scope === 'all')) {
                continue
            }

            tiers.push({
                sysId: tierGr.getUniqueValue(),
                floor: parseFloat(tierGr.getValue('attainment_floor_percent')) || 0,
                ceilingRaw: tierGr.getValue('attainment_ceiling_percent'),
                ceiling: parseFloat(tierGr.getValue('attainment_ceiling_percent')),
                dealType: normalizedScope
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

            var updateNeeded = false
            if ((updateGr.getValue('deal_type') || '') !== tier.dealType) {
                updateGr.setValue('deal_type', tier.dealType)
                results.tierDealTypesNormalized++
                updateNeeded = true
            }

            var currentCeiling = parseFloat(updateGr.getValue('attainment_ceiling_percent'))
            if (isNaN(currentCeiling) || currentCeiling <= tier.floor) {
                updateGr.setValue('attainment_ceiling_percent', resolvedCeiling)
                results.tierCeilingsBackfilled++
                updateNeeded = true
            }

            if (updateNeeded) {
                updateGr.update()
            }
        }
    }
}

function parseCandidates(rawDealType) {
    var raw = (rawDealType || '').toString()
    if (!raw) {
        return []
    }

    var seen = {}
    var out = []
    var parts = raw.split(/[;,|]+/)
    for (var i = 0; i < parts.length; i++) {
        var code = normalizeDealType(parts[i])
        if (!code || seen[code]) {
            continue
        }
        seen[code] = true
        out.push(code)
    }

    if (!out.length) {
        var fallback = normalizeDealType(raw)
        if (fallback) out.push(fallback)
    }

    return out
}

function normalizeDealType(value, defaultValue) {
    return normalizeDealTypeCanonical(value, defaultValue || 'other')
}
`,
        upgrade_safe: 'false',
    },
})
