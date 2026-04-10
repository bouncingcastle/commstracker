import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// ============================================================================
// PLAN TARGETS DEMO DATA - Annual quota targets per deal type per rep
// ============================================================================

// Abel Tuter Plan Targets
Record({
    $id: Now.ID['abel_target_new_business'],
    table: 'x_823178_commissio_plan_targets',
    data: {
        commission_plan: Now.ID['abel_plan_2026'],
        deal_type_ref: Now.ID['deal_type_new_business'],
        deal_type: 'new_business',
        commission_rate_percent: 8.0,
        annual_target_amount: 800000,
        description: 'New Business quota for Abel Tuter'
    }
})

Record({
    $id: Now.ID['abel_target_expansion'],
    table: 'x_823178_commissio_plan_targets',
    data: {
        commission_plan: Now.ID['abel_plan_2026'],
        deal_type_ref: Now.ID['deal_type_expansion'],
        deal_type: 'expansion',
        commission_rate_percent: 6.0,
        annual_target_amount: 200000,
        description: 'Expansion quota for Abel Tuter'
    }
})

Record({
    $id: Now.ID['abel_target_renewal'],
    table: 'x_823178_commissio_plan_targets',
    data: {
        commission_plan: Now.ID['abel_plan_2026'],
        deal_type_ref: Now.ID['deal_type_renewal'],
        deal_type: 'renewal',
        commission_rate_percent: 3.0,
        annual_target_amount: 300000,
        description: 'Renewal quota for Abel Tuter'
    }
})

// Adela Cervantsz Plan Targets (Senior Rep - Higher quotas)
Record({
    $id: Now.ID['adela_target_new_business'],
    table: 'x_823178_commissio_plan_targets',
    data: {
        commission_plan: Now.ID['adela_plan_2026'],
        deal_type_ref: Now.ID['deal_type_new_business'],
        deal_type: 'new_business',
        commission_rate_percent: 10.0,
        annual_target_amount: 1500000,
        description: 'New Business quota for Adela Cervantsz'
    }
})

Record({
    $id: Now.ID['adela_target_expansion'],
    table: 'x_823178_commissio_plan_targets',
    data: {
        commission_plan: Now.ID['adela_plan_2026'],
        deal_type_ref: Now.ID['deal_type_expansion'],
        deal_type: 'expansion',
        commission_rate_percent: 8.0,
        annual_target_amount: 1000000,
        description: 'Expansion quota for Adela Cervantsz'
    }
})

Record({
    $id: Now.ID['adela_target_renewal'],
    table: 'x_823178_commissio_plan_targets',
    data: {
        commission_plan: Now.ID['adela_plan_2026'],
        deal_type_ref: Now.ID['deal_type_renewal'],
        deal_type: 'renewal',
        commission_rate_percent: 4.0,
        annual_target_amount: 500000,
        description: 'Renewal quota for Adela Cervantsz'
    }
})

// Abraham Lincoln Plan Targets (Test/Demo data)
Record({
    $id: Now.ID['abraham_target_new_business'],
    table: 'x_823178_commissio_plan_targets',
    data: {
        commission_plan: Now.ID['abraham_plan_2026'],
        deal_type_ref: Now.ID['deal_type_new_business'],
        deal_type: 'new_business',
        commission_rate_percent: 5.0,
        annual_target_amount: 500000,
        description: 'New Business quota for Abraham Lincoln'
    }
})

Record({
    $id: Now.ID['abraham_target_expansion'],
    table: 'x_823178_commissio_plan_targets',
    data: {
        commission_plan: Now.ID['abraham_plan_2026'],
        deal_type_ref: Now.ID['deal_type_expansion'],
        deal_type: 'expansion',
        commission_rate_percent: 4.0,
        annual_target_amount: 300000,
        description: 'Expansion quota for Abraham Lincoln'
    }
})

// ============================================================================
// PLAN TIERS DEMO DATA - Commission rate acceleration by quota attainment
// ============================================================================

// Abel Tuter Commission Tiers
Record({
    $id: Now.ID['abel_tier_base'],
    table: 'x_823178_commissio_plan_tiers',
    data: {
        commission_plan: Now.ID['abel_plan_2026'],
        plan_target: Now.ID['abel_target_new_business'],
        tier_name: '0-100% of Quota',
        attainment_floor_percent: 0,
        attainment_ceiling_percent: 100,
        commission_rate_percent: 5.0,
        sort_order: 1,
        description: 'Base commission rate for Abel'
    }
})

Record({
    $id: Now.ID['abel_tier_accelerated'],
    table: 'x_823178_commissio_plan_tiers',
    data: {
        commission_plan: Now.ID['abel_plan_2026'],
        plan_target: Now.ID['abel_target_new_business'],
        tier_name: '101-120% of Quota',
        attainment_floor_percent: 101,
        attainment_ceiling_percent: 120,
        commission_rate_percent: 6.5,
        sort_order: 2,
        description: 'Accelerated rate for exceeding quota'
    }
})

Record({
    $id: Now.ID['abel_tier_stretch'],
    table: 'x_823178_commissio_plan_tiers',
    data: {
        commission_plan: Now.ID['abel_plan_2026'],
        plan_target: Now.ID['abel_target_new_business'],
        tier_name: '121%+ of Quota',
        attainment_floor_percent: 121,
        attainment_ceiling_percent: 9999.99,
        commission_rate_percent: 8.5,
        sort_order: 3,
        description: 'Premium rate for stretch goal achievement'
    }
})

// Adela Cervantsz Commission Tiers (Higher rates for senior rep)
Record({
    $id: Now.ID['adela_tier_base'],
    table: 'x_823178_commissio_plan_tiers',
    data: {
        commission_plan: Now.ID['adela_plan_2026'],
        plan_target: Now.ID['adela_target_new_business'],
        tier_name: '0-100% of Quota',
        attainment_floor_percent: 0,
        attainment_ceiling_percent: 100,
        commission_rate_percent: 6.0,
        sort_order: 1,
        description: 'Base commission rate for Adela'
    }
})

Record({
    $id: Now.ID['adela_tier_accelerated'],
    table: 'x_823178_commissio_plan_tiers',
    data: {
        commission_plan: Now.ID['adela_plan_2026'],
        plan_target: Now.ID['adela_target_new_business'],
        tier_name: '101-120% of Quota',
        attainment_floor_percent: 101,
        attainment_ceiling_percent: 120,
        commission_rate_percent: 7.5,
        sort_order: 2,
        description: 'Accelerated rate for exceeding quota'
    }
})

Record({
    $id: Now.ID['adela_tier_stretch'],
    table: 'x_823178_commissio_plan_tiers',
    data: {
        commission_plan: Now.ID['adela_plan_2026'],
        plan_target: Now.ID['adela_target_new_business'],
        tier_name: '121%+ of Quota',
        attainment_floor_percent: 121,
        attainment_ceiling_percent: 9999.99,
        commission_rate_percent: 9.5,
        sort_order: 3,
        description: 'Premium rate for stretch goal achievement'
    }
})

// Abraham Lincoln Commission Tiers
Record({
    $id: Now.ID['abraham_tier_base'],
    table: 'x_823178_commissio_plan_tiers',
    data: {
        commission_plan: Now.ID['abraham_plan_2026'],
        plan_target: Now.ID['abraham_target_new_business'],
        tier_name: '0-100% of Quota',
        attainment_floor_percent: 0,
        attainment_ceiling_percent: 100,
        commission_rate_percent: 4.5,
        sort_order: 1,
        description: 'Base commission rate for Abraham'
    }
})

Record({
    $id: Now.ID['abraham_tier_accelerated'],
    table: 'x_823178_commissio_plan_tiers',
    data: {
        commission_plan: Now.ID['abraham_plan_2026'],
        plan_target: Now.ID['abraham_target_new_business'],
        tier_name: '101%+ of Quota',
        attainment_floor_percent: 101,
        attainment_ceiling_percent: 9999.99,
        commission_rate_percent: 6.0,
        sort_order: 2,
        description: 'Accelerated rate for exceeding quota'
    }
})

// ============================================================================
// PLAN BONUSES DEMO DATA - Performance incentives and bonuses
// ============================================================================

// Abel Tuter Bonuses
Record({
    $id: Now.ID['abel_bonus_expansion'],
    table: 'x_823178_commissio_plan_bonuses',
    data: {
        commission_plan: Now.ID['abel_plan_2026'],
        bonus_name: 'Expansion Excellence',
        bonus_amount: 10000,
        qualification_metric: 'deal_amount',
        qualification_operator: 'gte',
        qualification_threshold: 250000,
        evaluation_period: 'calculation',
        one_time_per_period: false,
        bonus_trigger: 'Close $250K or more in expansion deals',
        deal_type: 'expansion',
        is_discretionary: false,
        is_active: true,
        description: 'Auto-earned for strong expansion performance'
    }
})

Record({
    $id: Now.ID['abel_bonus_quota'],
    table: 'x_823178_commissio_plan_bonuses',
    data: {
        commission_plan: Now.ID['abel_plan_2026'],
        bonus_name: 'Full Quota Achievement',
        bonus_amount: 15000,
        qualification_metric: 'quota_attainment_percent',
        qualification_operator: 'gte',
        qualification_threshold: 100,
        evaluation_period: 'annual',
        one_time_per_period: true,
        bonus_trigger: 'Achieve 100% or more of annual quota',
        deal_type: 'any',
        is_discretionary: false,
        is_active: true,
        description: 'Auto-earned for hitting quota targets'
    }
})

// Adela Cervantsz Bonuses (Higher amounts for senior rep)
Record({
    $id: Now.ID['adela_bonus_expansion'],
    table: 'x_823178_commissio_plan_bonuses',
    data: {
        commission_plan: Now.ID['adela_plan_2026'],
        bonus_name: 'Expansion Excellence',
        bonus_amount: 15000,
        qualification_metric: 'deal_amount',
        qualification_operator: 'gte',
        qualification_threshold: 1000000,
        evaluation_period: 'calculation',
        one_time_per_period: false,
        bonus_trigger: 'Close $1M or more in expansion deals',
        deal_type: 'expansion',
        is_discretionary: false,
        is_active: true,
        description: 'Auto-earned for exceptional expansion performance'
    }
})

Record({
    $id: Now.ID['adela_bonus_quota'],
    table: 'x_823178_commissio_plan_bonuses',
    data: {
        commission_plan: Now.ID['adela_plan_2026'],
        bonus_name: 'Full Quota Achievement',
        bonus_amount: 25000,
        qualification_metric: 'quota_attainment_percent',
        qualification_operator: 'gte',
        qualification_threshold: 100,
        evaluation_period: 'annual',
        one_time_per_period: true,
        bonus_trigger: 'Achieve 100% or more of annual quota',
        deal_type: 'any',
        is_discretionary: false,
        is_active: true,
        description: 'Auto-earned for hitting quota targets'
    }
})

Record({
    $id: Now.ID['adela_bonus_stretch'],
    table: 'x_823178_commissio_plan_bonuses',
    data: {
        commission_plan: Now.ID['adela_plan_2026'],
        bonus_name: 'Stretch Goal Achievement',
        bonus_amount: 50000,
        qualification_metric: 'quota_attainment_percent',
        qualification_operator: 'gte',
        qualification_threshold: 150,
        evaluation_period: 'annual',
        one_time_per_period: true,
        bonus_trigger: 'Achieve 150% or more of annual quota',
        deal_type: 'any',
        is_discretionary: false,
        is_active: true,
        description: 'Auto-earned for exceptional overachievement'
    }
})

// Abraham Lincoln Bonuses
Record({
    $id: Now.ID['abraham_bonus_quota'],
    table: 'x_823178_commissio_plan_bonuses',
    data: {
        commission_plan: Now.ID['abraham_plan_2026'],
        bonus_name: 'Quota Achievement',
        bonus_amount: 12000,
        qualification_metric: 'quota_attainment_percent',
        qualification_operator: 'gte',
        qualification_threshold: 100,
        evaluation_period: 'annual',
        one_time_per_period: true,
        bonus_trigger: 'Achieve 100% or more of annual quota',
        deal_type: 'any',
        is_discretionary: false,
        is_active: true,
        description: 'Auto-earned for hitting targets'
    }
})

Record({
    $id: Now.ID['abraham_bonus_manager'],
    table: 'x_823178_commissio_plan_bonuses',
    data: {
        commission_plan: Now.ID['abraham_plan_2026'],
        bonus_name: 'Manager Discretionary',
        bonus_amount: 5000,
        qualification_metric: 'quota_attainment_percent',
        qualification_operator: 'gte',
        qualification_threshold: 0,
        evaluation_period: 'annual',
        one_time_per_period: false,
        bonus_trigger: 'Awarded at manager discretion for merit',
        deal_type: 'any',
        is_discretionary: true,
        is_active: true,
        description: 'Discretionary bonus per manager judgment'
    }
})

// ============================================================================
// COMMISSION STATEMENTS DEMO DATA - Monthly commission summaries
// ============================================================================

// Abel's January 2026 Statement
Record({
    $id: Now.ID['abel_statement_jan_2026'],
    table: 'x_823178_commissio_commission_statements',
    data: {
        sales_rep: '62826bf03710200044e0bfc8bcbe5df1', // Abel Tuter
        commission_plan: Now.ID['abel_plan_2026'],
        statement_period_start: '2026-01-01',
        statement_period_end: '2026-01-31',
        total_earned: 4400,
        total_paid: 4400,
        pending_amount: 0,
        statement_number: '1',
        statement_year: 2026,
        statement_month: 202601,
        generated_date: '2026-02-03 08:00:00',
        status: 'paid',
        notes: 'January commission statement - CloudTech deal closed'
    }
})

// Abel's February 2026 Statement
Record({
    $id: Now.ID['abel_statement_feb_2026'],
    table: 'x_823178_commissio_commission_statements',
    data: {
        sales_rep: '62826bf03710200044e0bfc8bcbe5df1', // Abel Tuter
        commission_plan: Now.ID['abel_plan_2026'],
        statement_period_start: '2026-02-01',
        statement_period_end: '2026-02-28',
        total_earned: 2100,
        total_paid: 0,
        pending_amount: 2100,
        statement_number: '2',
        statement_year: 2026,
        statement_month: 202602,
        generated_date: '2026-03-01 08:00:00',
        status: 'draft',
        notes: 'February commission statement - DataVault expansion'
    }
})

// Adela's January 2026 Statement
Record({
    $id: Now.ID['adela_statement_jan_2026'],
    table: 'x_823178_commissio_commission_statements',
    data: {
        sales_rep: '0a826bf03710200044e0bfc8bcbe5d7a', // Adela Cervantsz
        commission_plan: Now.ID['adela_plan_2026'],
        statement_period_start: '2026-01-01',
        statement_period_end: '2026-01-31',
        total_earned: 6500,
        total_paid: 6500,
        pending_amount: 0,
        statement_number: '1',
        statement_year: 2026,
        statement_month: 202601,
        generated_date: '2026-02-03 08:00:00',
        status: 'paid',
        notes: 'January statement - Premium deal closed'
    }
})

// ============================================================================
// EXCEPTION APPROVALS DEMO DATA - Commission exceptions requiring approval
// ============================================================================

Record({
    $id: Now.ID['exception_abel_override'],
    table: 'x_823178_commissio_exception_approvals',
    data: {
        sales_rep: '62826bf03710200044e0bfc8bcbe5df1', // Abel Tuter
        deal: Now.ID['demo_deal_abel_2'],
        exception_type: 'rate_override',
        base_rate: 6.0,
        approved_rate: 7.0,
        reason: 'Strategic account retention - override approved by manager',
        requested_by: '62826bf03710200044e0bfc8bcbe5df1',
        approved_by: 'sys_user:U4',
        approval_date: '2026-02-09 11:30:00',
        status: 'approved',
        request_type: 'high_value_deal',
        reference_record: 'faab0aac81e1445fa5a675815f269c60',
        reference_table: 'x_823178_commissio_deals',
        request_date: '2026-02-09 11:00:00',
        business_justification: 'Strategic account',
        notes: 'DataVault expansion - special arrangement'
    }
})

Record({
    $id: Now.ID['exception_adela_pending'],
    table: 'x_823178_commissio_exception_approvals',
    data: {
        sales_rep: '0a826bf03710200044e0bfc8bcbe5d7a', // Adela Cervantsz
        exception_type: 'bonus_adjustment',
        reason: 'Early payment discount reconciliation',
        requested_by: '0a826bf03710200044e0bfc8bcbe5d7a',
        adjustment_amount: 500,
        status: 'pending',
        request_type: 'high_value_commission',
        reference_record: '',
        reference_table: '',
        business_justification: 'Customer early payment',
        notes: 'Customer paid invoice early - requesting courtesy bonus',
        request_date: '2026-02-25 09:00:00'
    }
})

// ============================================================================
// SYSTEM ALERTS DEMO DATA - Monitoring and alerting
// ============================================================================

Record({
    $id: Now.ID['alert_sync_success'],
    table: 'x_823178_commissio_system_alerts',
    data: {
        alert_type: 'sync_success',
        title: 'Zoho Integration Sync Complete',
        message: 'Successfully synced 5 deals, 3 invoices, 2 payments from Zoho',
        severity: 'low',
        status: 'resolved',
        alert_date: '2026-02-28 06:00:00',
        occurred_at: '2026-02-28 06:00:00',
        resolved_at: '2026-02-28 06:05:00',
        alert_source: 'Zoho Integration Scheduler'
    }
})

Record({
    $id: Now.ID['alert_calculation_ready'],
    table: 'x_823178_commissio_system_alerts',
    data: {
        alert_type: 'calculation_ready',
        title: 'Commission Calculations Ready for Review',
        message: '3 new commission calculations are ready for approval',
        severity: 'medium',
        status: 'open',
        alert_date: '2026-02-28 10:30:00',
        occurred_at: '2026-02-28 10:30:00',
        alert_source: 'Commission Calculation Engine'
    }
})

Record({
    $id: Now.ID['alert_reconciliation_mismatch'],
    table: 'x_823178_commissio_system_alerts',
    data: {
        alert_type: 'reconciliation_mismatch',
        title: 'Daily Reconciliation Issue Detected',
        message: '1 payment amount mismatch detected between Books and Commission system',
        severity: 'high',
        status: 'open',
        alert_date: '2026-02-28 18:15:00',
        occurred_at: '2026-02-28 18:15:00',
        alert_source: 'Daily Reconciliation Job'
    }
})

// ============================================================================
// RECONCILIATION LOG DEMO DATA - Daily sync and reconciliation audit trail
// ============================================================================

Record({
    $id: Now.ID['recon_daily_2026_02_28'],
    table: 'x_823178_commissio_reconciliation_log',
    data: {
        reconciliation_date: '2026-02-28 00:00:00',
        reconciliation_type: 'daily',
        deals_synced: 2,
        invoices_synced: 2,
        payments_synced: 1,
        calculations_created: 2,
        total_amount_processed: 95000,
        discrepancies_found: 0,
        errors_encountered: 0,
        status: 'passed',
        notes: 'Daily sync completed successfully - all systems aligned',
        execution_time_ms: 2341,
        started_at: '2026-02-28 06:00:00',
        completed_at: '2026-02-28 06:00:02.341',
        executed_by: 'Scheduled Job: Daily Reconciliation'
    }
})

Record({
    $id: Now.ID['recon_daily_2026_02_27'],
    table: 'x_823178_commissio_reconciliation_log',
    data: {
        reconciliation_date: '2026-02-27 00:00:00',
        reconciliation_type: 'daily',
        deals_synced: 3,
        invoices_synced: 3,
        payments_synced: 2,
        calculations_created: 3,
        total_amount_processed: 185000,
        discrepancies_found: 0,
        errors_encountered: 0,
        status: 'passed',
        notes: 'Daily reconciliation - all records matched',
        execution_time_ms: 3156,
        started_at: '2026-02-27 06:00:00',
        completed_at: '2026-02-27 06:00:03.156',
        executed_by: 'Scheduled Job: Daily Reconciliation'
    }
})

Record({
    $id: Now.ID['recon_monthly_2026_01'],
    table: 'x_823178_commissio_reconciliation_log',
    data: {
        reconciliation_date: '2026-02-03 00:00:00',
        reconciliation_type: 'monthly',
        deals_synced: 25,
        invoices_synced: 24,
        payments_synced: 22,
        calculations_created: 20,
        total_amount_processed: 1850000,
        discrepancies_found: 0,
        errors_encountered: 0,
        status: 'passed',
        period: '2026-01',
        notes: 'January monthly reconciliation complete - perfect match',
        execution_time_ms: 5421,
        started_at: '2026-02-03 07:00:00',
        completed_at: '2026-02-03 07:00:05.421',
        executed_by: 'Scheduled Job: Monthly Reconciliation'
    }
})
