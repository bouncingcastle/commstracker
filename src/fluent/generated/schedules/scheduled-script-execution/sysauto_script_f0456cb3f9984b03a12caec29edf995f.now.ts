import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['f0456cb3f9984b03a12caec29edf995f'],
    table: 'sysauto_script',
    data: {
        active: 'false',
        advanced: 'false',
        conditional: 'false',
        name: 'Commission Bonus Scenario Seed',
        run_time: '2026-03-05 21:25:48',
        run_type: 'on_demand',
        script: `import { gs, GlideRecord } from '@servicenow/glide'

export function seedBonusScenarios() {
    var enabled = toBool(gs.getProperty('x_823178_commissio.seed_bonus_scenarios_enabled', 'false'));
    var mode = (gs.getProperty('x_823178_commissio.seed_idempotency_mode', 'strict') || 'strict').toLowerCase();

    if (!enabled) {
        gs.info('Commission Management: Bonus scenario seed skipped because x_823178_commissio.seed_bonus_scenarios_enabled=false');
        return;
    }

    if (mode === 'strict' && !toBool(gs.getProperty('x_823178_commissio.seed_demo_data_enabled', 'false'))) {
        gs.warn('Commission Management: Bonus scenario seed blocked by strict idempotency mode because seed_demo_data_enabled=false');
        return;
    }

    var planGr = new GlideRecord('x_823178_commissio_commission_plans');
    planGr.addQuery('is_active', true);
    planGr.query();

    var processedPlans = 0;
    var created = 0;
    var updated = 0;

    while (planGr.next()) {
        processedPlans++;
        var planId = planGr.getUniqueValue();

        var definitions = getSeedDefinitions();
        for (var i = 0; i < definitions.length; i++) {
            var outcome = upsertBonus(planId, definitions[i]);
            if (outcome === 'created') {
                created++;
            } else if (outcome === 'updated') {
                updated++;
            }
        }
    }

    gs.info('Commission Management: Bonus scenario seed completed. plans=' + processedPlans + ', created=' + created + ', updated=' + updated);
}

function getSeedDefinitions() {
    return [
        {
            bonus_name: 'Seed - One-Time Quota Hit',
            bonus_amount: 1500,
            qualification_metric: 'quota_attainment_percent',
            qualification_operator: 'gte',
            qualification_threshold: 100,
            evaluation_period: 'annual',
            one_time_per_period: true,
            deal_type: 'any',
            is_discretionary: false,
            payout_frequency: 'annual',
            auto_payout: true,
            description: 'Seed scenario: one-time annual bonus when rep reaches 100% quota.'
        },
        {
            bonus_name: 'Seed - Large New Business Deal',
            bonus_amount: 750,
            qualification_metric: 'deal_amount',
            qualification_operator: 'gte',
            qualification_threshold: 50000,
            evaluation_period: 'calculation',
            one_time_per_period: false,
            deal_type: 'new_business',
            is_discretionary: false,
            payout_frequency: 'quarterly',
            auto_payout: true,
            description: 'Seed scenario: edge threshold for new business deal amount qualification.'
        },
        {
            bonus_name: 'Seed - High Base Commission',
            bonus_amount: 500,
            qualification_metric: 'base_commission_amount',
            qualification_operator: 'gte',
            qualification_threshold: 2000,
            evaluation_period: 'monthly',
            one_time_per_period: false,
            deal_type: 'any',
            is_discretionary: false,
            payout_frequency: 'quarterly',
            auto_payout: true,
            description: 'Seed scenario: bonus on high base commission amount to test threshold edge cases.'
        }
    ];
}

function upsertBonus(planId, definition) {
    var bonusGr = new GlideRecord('x_823178_commissio_plan_bonuses');
    bonusGr.addQuery('commission_plan', planId);
    bonusGr.addQuery('bonus_name', definition.bonus_name);
    bonusGr.setLimit(1);
    bonusGr.query();

    var isUpdate = bonusGr.next();
    if (!isUpdate) {
        bonusGr.initialize();
        bonusGr.setValue('commission_plan', planId);
        bonusGr.setValue('bonus_name', definition.bonus_name);
    }

    bonusGr.setValue('bonus_amount', definition.bonus_amount);
    bonusGr.setValue('qualification_metric', definition.qualification_metric);
    bonusGr.setValue('qualification_operator', definition.qualification_operator);
    bonusGr.setValue('qualification_threshold', definition.qualification_threshold);
    bonusGr.setValue('evaluation_period', definition.evaluation_period);
    bonusGr.setValue('one_time_per_period', definition.one_time_per_period);
    bonusGr.setValue('deal_type', definition.deal_type);
    bonusGr.setValue('is_discretionary', definition.is_discretionary);
    bonusGr.setValue('payout_frequency', definition.payout_frequency);
    bonusGr.setValue('auto_payout', definition.auto_payout);
    bonusGr.setValue('is_active', true);
    bonusGr.setValue('description', definition.description);

    if (isUpdate) {
        bonusGr.update();
        return 'updated';
    }

    bonusGr.insert();
    return 'created';
}

function toBool(value) {
    return value === true || value === 'true' || value === '1' || value === 1;
}
`,
        upgrade_safe: 'false',
    },
})
