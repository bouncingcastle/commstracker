// Script Include: CommissionProgressHelper
// Provides AJAX data aggregation for sales rep commission progress view

var CommissionProgressHelper = Class.create();
CommissionProgressHelper.prototype = Object.extendsObject(AbstractAjaxProcessor, {
    
    getRepProgress: function() {
        var userId = this.getParameter('sysparm_name') === 'getRepProgress' ? this.getParameter('user_id') : null;
        
        if (!userId) {
            return this.getErrorJSON('No user ID provided');
        }

        try {
            var result = {
                status: 'success',
                data: {
                    total_earned: 0,
                    pending_amount: 0,
                    pending_count: 0,
                    paid_amount: 0,
                    paid_count: 0,
                    active_deals_count: 0,
                    pipeline_value: 0,
                    breakdown: {},
                    deal_breakdown: {},
                    recent_calculations: [],
                    active_deals: []
                }
            };

            // Get current year start date
            var today = new GlideDateTime();
            var yearStart = new GlideDateTime();
            yearStart.setMonthLocalTime(1, 1);
            yearStart.setDateLocalTime(today.getYearLocalTime(), 1, 1);

            // Fetch commission calculations for this rep
            var calcGr = new GlideRecord('x_823178_commissio_commission_calculations');
            calcGr.addQuery('sales_rep', userId);
            calcGr.addQuery('calculation_date', '>=', yearStart.getDisplayValue());
            calcGr.orderBy('-calculation_date');
            calcGr.query();

            var totalEarned = 0;
            var pendingAmount = 0;
            var pendingCount = 0;
            var paidAmount = 0;
            var paidCount = 0;
            var breakdown = { 'New Business': 0, 'Renewal': 0, 'Expansion': 0, 'Upsell': 0, 'Other': 0 };
            var recentCalcs = [];
            var calcCount = 0;

            while (calcGr.next() && calcCount < 10) {
                var commAmount = parseFloat(calcGr.getValue('commission_amount')) || 0;
                var status = calcGr.getValue('status') || 'draft';
                var dealType = calcGr.getValue('deal_type') || 'other';

                // Accumulate totals
                if (status === 'paid' || status === 'locked') {
                    paidAmount += commAmount;
                    paidCount++;
                } else if (status === 'draft') {
                    pendingAmount += commAmount;
                    pendingCount++;
                }
                totalEarned += commAmount;

                // Breakdown by deal type
                if (breakdown[dealType] !== undefined) {
                    breakdown[dealType] += commAmount;
                } else {
                    breakdown['Other'] += commAmount;
                }

                // Recent calculations (for table)
                if (recentCalcs.length < 10) {
                    var dealGr = new GlideRecord('x_823178_commissio_deals');
                    dealGr.get(calcGr.getValue('deal'));
                    
                    recentCalcs.push({
                        deal_name: dealGr.getDisplayValue('deal_name'),
                        deal_type: calcGr.getValue('deal_type'),
                        commission_base_amount: calcGr.getValue('commission_base_amount'),
                        commission_rate: calcGr.getValue('commission_rate'),
                        commission_amount: calcGr.getValue('commission_amount'),
                        payment_date: calcGr.getValue('payment_date'),
                        status: status
                    });
                }
                calcCount++;
            }

            result.data.total_earned = totalEarned;
            result.data.pending_amount = pendingAmount;
            result.data.pending_count = pendingCount;
            result.data.paid_amount = paidAmount;
            result.data.paid_count = paidCount;
            result.data.breakdown = breakdown;
            result.data.recent_calculations = recentCalcs;

            // Fetch active deals for this rep (current or future owner)
            var dealGr = new GlideRecord('x_823178_commissio_deals');
            dealGr.addQuery('current_owner', userId);
            dealGr.addQuery('is_won', false);
            dealGr.addQuery('stage', '!=', 'closed_lost');
            dealGr.orderBy('close_date');
            dealGr.query();

            var activeDeals = [];
            var pipelineValue = 0;
            var dealBreakdown = { 'New Business': 0, 'Renewal': 0, 'Expansion': 0, 'Upsell': 0, 'Other': 0 };
            var dealCount = 0;

            while (dealGr.next() && dealCount < 50) {
                var dealAmount = parseFloat(dealGr.getValue('amount')) || 0;
                var dealType = dealGr.getValue('deal_type') || 'other';

                pipelineValue += dealAmount;

                if (dealBreakdown[dealType] !== undefined) {
                    dealBreakdown[dealType] += dealAmount;
                } else {
                    dealBreakdown['Other'] += dealAmount;
                }

                // Active deals table (first 20)
                if (activeDeals.length < 20) {
                    activeDeals.push({
                        deal_name: dealGr.getValue('deal_name'),
                        account_name: dealGr.getValue('account_name'),
                        amount: dealAmount,
                        deal_type: dealType,
                        stage: dealGr.getValue('stage'),
                        close_date: dealGr.getValue('close_date')
                    });
                }
                dealCount++;
            }

            result.data.active_deals_count = dealCount;
            result.data.pipeline_value = pipelineValue;
            result.data.deal_breakdown = dealBreakdown;
            result.data.active_deals = activeDeals;

            return JSON.stringify(result);

        } catch (e) {
            gs.error('CommissionProgressHelper error: ' + e.message);
            return this.getErrorJSON('Error fetching commission progress: ' + e.message);
        }
    },

    getErrorJSON: function(msg) {
        return JSON.stringify({
            status: 'error',
            message: msg
        });
    },

    type: 'CommissionProgressHelper'
});
