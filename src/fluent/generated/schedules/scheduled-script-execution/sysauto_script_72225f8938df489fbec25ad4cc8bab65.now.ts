import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['72225f8938df489fbec25ad4cc8bab65'],
    table: 'sysauto_script',
    data: {
        active: 'false',
        advanced: 'false',
        conditional: 'false',
        name: 'Backfill Commission Payout Eligibility Dates',
        run_time: '2026-03-06 01:36:56',
        run_type: 'daily',
        script: `import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide'

export function backfillPayoutEligibilityDates() {
    gs.info('Commission Management: Starting payout eligibility backfill');

    var updated = 0;
    var skipped = 0;
    var failed = 0;

    try {
        var batchLimit = parseInt(gs.getProperty('x_823178_commissio.payout_backfill_limit', '5000'), 10);
        if (isNaN(batchLimit) || batchLimit < 1) {
            batchLimit = 5000;
        }

        var includeAlreadyPopulated = String(gs.getProperty('x_823178_commissio.payout_backfill_recompute_existing', 'false')) === 'true';

        var calcGr = new GlideRecord('x_823178_commissio_commission_calculations');
        calcGr.addNotNullQuery('payment_date');
        if (!includeAlreadyPopulated) {
            calcGr.addNullQuery('payout_eligible_date');
        }
        calcGr.orderBy('sys_created_on');
        calcGr.setLimit(batchLimit);
        calcGr.query();

        while (calcGr.next()) {
            try {
                var paymentDate = calcGr.getValue('payment_date');
                if (!paymentDate) {
                    skipped++;
                    continue;
                }

                var payoutSchedule = getPayoutSchedule(paymentDate);
                if (!payoutSchedule.payout_eligible_date) {
                    skipped++;
                    continue;
                }

                calcGr.setValue('payout_eligible_date', payoutSchedule.payout_eligible_date);
                calcGr.setValue('payout_schedule_snapshot', payoutSchedule.snapshot);
                calcGr.update();
                updated++;
            } catch (rowError) {
                failed++;
                gs.error('Commission Management: Backfill failed for calculation ' + calcGr.getUniqueValue() + ' - ' + rowError.message);
            }
        }

        gs.info('Commission Management: Payout eligibility backfill completed. Updated=' + updated + ', Skipped=' + skipped + ', Failed=' + failed);
    } catch (e) {
        gs.error('Commission Management: Payout eligibility backfill failed - ' + e.message);
    }
}

function getPayoutSchedule(paymentDateValue) {
    var fallback = {
        payout_eligible_date: paymentDateValue,
        snapshot: 'mode=fallback;eligible=' + paymentDateValue
    };

    if (!paymentDateValue) {
        return fallback;
    }

    try {
        var mode = (gs.getProperty('x_823178_commissio.payout_schedule_mode', 'cycle') || 'cycle').toLowerCase();
        var paymentDate = new GlideDateTime();
        paymentDate.setValue(paymentDateValue);

        if (mode === 'days') {
            var waitDays = parseInt(gs.getProperty('x_823178_commissio.payout_wait_days', '28'), 10);
            if (isNaN(waitDays) || waitDays < 0) waitDays = 28;

            var byDays = new GlideDateTime(paymentDate);
            byDays.addDaysUTC(waitDays);
            var byDaysDate = toDateString(byDays);

            return {
                payout_eligible_date: byDaysDate,
                snapshot: 'mode=days;wait_days=' + waitDays + ';eligible=' + byDaysDate
            };
        }

        var cycleDays = parseInt(gs.getProperty('x_823178_commissio.pay_cycle_days', '14'), 10);
        if (isNaN(cycleDays) || cycleDays < 1) cycleDays = 14;

        var cyclesAfterPayment = parseInt(gs.getProperty('x_823178_commissio.pay_cycles_after_payment', '2'), 10);
        if (isNaN(cyclesAfterPayment) || cyclesAfterPayment < 1) cyclesAfterPayment = 2;

        var anchorDateRaw = gs.getProperty('x_823178_commissio.pay_cycle_anchor_date', '2026-01-01') || '2026-01-01';
        var anchorDate = new GlideDateTime();
        anchorDate.setValue((anchorDateRaw.length === 10 ? anchorDateRaw + ' 00:00:00' : anchorDateRaw));

        var nextCycleStart = new GlideDateTime(anchorDate);
        while (!nextCycleStart.after(paymentDate)) {
            nextCycleStart.addDaysUTC(cycleDays);
        }

        var payoutDate = new GlideDateTime(nextCycleStart);
        payoutDate.addDaysUTC((cyclesAfterPayment - 1) * cycleDays);
        var payoutDateValue = toDateString(payoutDate);

        return {
            payout_eligible_date: payoutDateValue,
            snapshot: 'mode=cycle;cycle_days=' + cycleDays + ';cycles_after=' + cyclesAfterPayment + ';anchor=' + anchorDateRaw + ';eligible=' + payoutDateValue
        };
    } catch (e) {
        gs.error('Commission Management: Failed to compute payout schedule during backfill - ' + e.message);
        return fallback;
    }
}

function toDateString(dateTime) {
    var value = dateTime ? dateTime.getValue() : '';
    if (!value) return '';
    return value.substring(0, 10);
}
`,
        upgrade_safe: 'false',
    },
})
