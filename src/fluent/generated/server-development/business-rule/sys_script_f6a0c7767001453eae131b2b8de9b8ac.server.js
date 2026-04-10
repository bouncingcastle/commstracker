(function executeRule(current, previous) {
    var previousStage = previous ? (previous.getValue('stage') || '') : '';

    if (current.getValue('stage') !== 'closed_won' || previousStage === 'closed_won') return;
    if (current.getValue('snapshot_taken') !== '1') return;
    if (!current.getValue('owner_at_close')) return;

    try {
        var dealId = current.getUniqueValue();
        var salesRep = current.getValue('owner_at_close');
        var closeDate = current.getValue('close_date');
        var dealAmount = parseFloat(current.getValue('amount')) || 0;
        var dealTypeRef = (current.getValue('deal_type_ref') || '').toString();

        if (!salesRep || !closeDate || dealAmount <= 0) {
            gs.warn('Commission Management: Skipping deal-close draft - missing rep, close date, or amount for deal ' + dealId);
            return;
        }

        // Avoid duplicate drafts
        var existingDraft = new GlideRecord('x_823178_commissio_commission_calculations');
        existingDraft.addQuery('deal', dealId);
        existingDraft.addNullQuery('payment');
        existingDraft.addQuery('status', 'draft');
        existingDraft.query();
        if (existingDraft.next()) return;

        // Find commission plan active at close date
        var planGr = new GlideRecord('x_823178_commissio_commission_plans');
        planGr.addQuery('sales_rep', salesRep);
        planGr.addQuery('effective_start_date', '<=', closeDate);
        planGr.addQuery('is_active', true);
        planGr.addNullQuery('effective_end_date').addOrCondition('effective_end_date', '>=', closeDate);
        planGr.orderByDesc('effective_start_date');
        planGr.setLimit(1);
        planGr.query();
        if (!planGr.next()) {
            gs.warn('Commission Management: No commission plan for deal ' + current.getValue('deal_name'));
            return;
        }
        var planId = planGr.getUniqueValue();

        // Resolve deal type code
        var dealTypeCode = '';
        if (dealTypeRef) {
            var dtGr = new GlideRecord('x_823178_commissio_deal_types');
            if (dtGr.get(dealTypeRef)) {
                dealTypeCode = (dtGr.getValue('code') || '').toString().toLowerCase()
                    .replace(/[\s\-]+/g, '_').replace(/__+/g, '_').replace(/^_+|_+$/g, '');
            }
        }

        // Get base rate and quota from matching plan target
        var baseRate = 0;
        var targetQuota = 0;
        var targetGr = new GlideRecord('x_823178_commissio_plan_targets');
        targetGr.addQuery('commission_plan', planId);
        targetGr.addQuery('is_active', true);
        targetGr.query();
        while (targetGr.next()) {
            if (dealTypeCode) {
                var tDtRef = targetGr.getValue('deal_type_ref');
                if (tDtRef) {
                    var tDtGr = new GlideRecord('x_823178_commissio_deal_types');
                    if (tDtGr.get(tDtRef)) {
                        var tDtCode = (tDtGr.getValue('code') || '').toString().toLowerCase()
                            .replace(/[\s\-]+/g, '_').replace(/__+/g, '_').replace(/^_+|_+$/g, '');
                        if (tDtCode !== dealTypeCode) continue;
                    }
                }
            }
            var r = parseFloat(targetGr.getValue('commission_rate_percent')) || 0;
            if (r > 0) {
                baseRate = r;
                targetQuota = parseFloat(targetGr.getValue('annual_target_amount')) || 0;
                break;
            }
        }

        if (baseRate <= 0) {
            gs.warn('Commission Management: No commission rate found for deal ' + current.getValue('deal_name'));
            return;
        }

        // Calculate YTD attainment for this deal type (including this deal)
        var yearStart = closeDate.substring(0, 4) + '-01-01';
        var attainedAmount = 0;
        var attainGr = new GlideRecord('x_823178_commissio_deals');
        attainGr.addQuery('owner_at_close', salesRep);
        attainGr.addQuery('stage', 'closed_won');
        attainGr.addQuery('close_date', '>=', yearStart);
        attainGr.addQuery('close_date', '<=', closeDate);
        if (dealTypeRef) attainGr.addQuery('deal_type_ref', dealTypeRef);
        attainGr.query();
        while (attainGr.next()) {
            attainedAmount += parseFloat(attainGr.getValue('amount')) || 0;
        }
        // Include current deal if not yet in DB (insert case)
        if (!attainedAmount || attainedAmount < dealAmount) {
            attainedAmount = Math.max(attainedAmount, dealAmount);
        }

        var attainmentPercent = targetQuota > 0 ? (attainedAmount / targetQuota) * 100 : 0;

        // Find the highest applicable tier based on attainment
        var commissionRate = baseRate;
        var acceleratorApplied = false;
        var effectiveTierName = '';
        var effectiveTierFloor = 0;

        if (attainmentPercent > 0) {
            var tierGr = new GlideRecord('x_823178_commissio_plan_tiers');
            tierGr.addQuery('commission_plan', planId);
            tierGr.addQuery('is_active', true);
            tierGr.addQuery('attainment_floor_percent', '<=', attainmentPercent);
            tierGr.orderByDesc('attainment_floor_percent');
            tierGr.setLimit(1);
            tierGr.query();
            if (tierGr.next()) {
                var tierRate = parseFloat(tierGr.getValue('commission_rate_percent')) || 0;
                if (tierRate > commissionRate) {
                    commissionRate = tierRate;
                    acceleratorApplied = true;
                    effectiveTierName = tierGr.getValue('tier_name') || '';
                    effectiveTierFloor = parseFloat(tierGr.getValue('attainment_floor_percent')) || 0;
                }
            }
        }

        var commissionAmount = Math.round(dealAmount * (commissionRate / 100) * 100) / 100;

        var calcGr = new GlideRecord('x_823178_commissio_commission_calculations');
        calcGr.initialize();
        calcGr.setValue('deal', dealId);
        calcGr.setValue('sales_rep', salesRep);
        calcGr.setValue('commission_plan', planId);
        calcGr.setValue('commission_base_amount', dealAmount);
        calcGr.setValue('commission_rate', commissionRate);
        calcGr.setValue('commission_amount', commissionAmount);
        calcGr.setValue('base_commission_component', commissionAmount);
        calcGr.setValue('deal_close_date', closeDate);
        calcGr.setValue('attainment_percent_at_calc', attainmentPercent);
        calcGr.setValue('attained_amount_snapshot', attainedAmount);
        calcGr.setValue('quota_amount_snapshot', targetQuota);
        calcGr.setValue('accelerator_applied', acceleratorApplied);
        if (effectiveTierName) calcGr.setValue('effective_tier_name', effectiveTierName);
        if (effectiveTierFloor) calcGr.setValue('effective_tier_floor_percent', effectiveTierFloor);
        if (dealTypeRef) calcGr.setValue('deal_type_ref', dealTypeRef);
        calcGr.setValue('calculation_date', new GlideDateTime().getDisplayValue());
        calcGr.setValue('original_calculation_date', new GlideDateTime().getDisplayValue());
        calcGr.setValue('status', 'draft');
        calcGr.setValue('calculation_inputs', JSON.stringify({
            source: 'deal_close_draft',
            dealAmount: dealAmount,
            commissionRate: commissionRate,
            baseRate: baseRate,
            acceleratorApplied: acceleratorApplied,
            attainmentPercent: Math.round(attainmentPercent * 10) / 10,
            attainedAmount: attainedAmount,
            quota: targetQuota,
            planId: planId,
            note: 'Estimated commission pending payment receipt.'
        }));

        var draftId = calcGr.insert();
        if (draftId) {
            gs.info('Commission Management: Draft $' + commissionAmount.toFixed(2) +
                ' at ' + commissionRate + '%' + (acceleratorApplied ? ' [ACCELERATOR: ' + effectiveTierName + ']' : '') +
                ' (' + Math.round(attainmentPercent) + '% attainment) for deal ' + current.getValue('deal_name'));
        }
    } catch(e) {
        gs.error('Commission Management: Error creating deal-close commission draft - ' + e.message);
    }
})(current, previous);