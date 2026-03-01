import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// BUSINESS REQUIREMENT: System properties for operational flexibility
Record({
    $id: Now.ID['max_commission_per_payment_prop'],
    table: 'sys_properties',
    data: {
        name: 'x_823178_commissio.max_commission_per_payment',
        value: '50000',
        description: 'Maximum commission amount allowed per single payment (default: $50,000)',
        type: 'string',
        suffix: 'Commission Management'
    }
})

Record({
    $id: Now.ID['max_deal_amount_prop'],
    table: 'sys_properties',
    data: {
        name: 'x_823178_commissio.max_deal_amount',
        value: '10000000',
        description: 'Maximum deal amount without manual approval (default: $10,000,000)',
        type: 'string',
        suffix: 'Commission Management'
    }
})

Record({
    $id: Now.ID['approval_threshold_prop'],
    table: 'sys_properties',
    data: {
        name: 'x_823178_commissio.approval_threshold',
        value: '10000',
        description: 'Commission amount requiring finance approval (default: $10,000)',
        type: 'string',
        suffix: 'Commission Management'
    }
})

Record({
    $id: Now.ID['reconciliation_variance_threshold_prop'],
    table: 'sys_properties',
    data: {
        name: 'x_823178_commissio.reconciliation_variance_threshold',
        value: '100',
        description: 'Reconciliation variance amount triggering alert (default: $100)',
        type: 'string',
        suffix: 'Commission Management'
    }
})

Record({
    $id: Now.ID['calculation_timeout_prop'],
    table: 'sys_properties',
    data: {
        name: 'x_823178_commissio.calculation_timeout_minutes',
        value: '5',
        description: 'Timeout for commission calculation locks (default: 5 minutes)',
        type: 'integer',
        suffix: 'Commission Management'
    }
})

Record({
    $id: Now.ID['statement_freeze_hours_prop'],
    table: 'sys_properties',
    data: {
        name: 'x_823178_commissio.statement_freeze_hours',
        value: '24',
        description: 'Hours before statement generation when data changes are frozen (default: 24)',
        type: 'integer',
        suffix: 'Commission Management'
    }
})

Record({
    $id: Now.ID['max_payment_amount_prop'],
    table: 'sys_properties',
    data: {
        name: 'x_823178_commissio.max_payment_amount',
        value: '5000000',
        description: 'Maximum payment amount allowed (default: $5,000,000)',
        type: 'string',
        suffix: 'Commission Management'
    }
})

Record({
    $id: Now.ID['enable_audit_mode_prop'],
    table: 'sys_properties',
    data: {
        name: 'x_823178_commissio.enable_audit_mode',
        value: 'true',
        description: 'Enable enhanced audit mode with detailed logging (default: true)',
        type: 'boolean',
        suffix: 'Commission Management'
    }
})

Record({
    $id: Now.ID['allow_retroactive_changes_prop'],
    table: 'sys_properties',
    data: {
        name: 'x_823178_commissio.allow_retroactive_changes',
        value: 'false',
        description: 'Allow changes to closed deals and calculated commissions (default: false)',
        type: 'boolean',
        suffix: 'Commission Management'
    }
})

Record({
    $id: Now.ID['duplicate_detection_enabled_prop'],
    table: 'sys_properties',
    data: {
        name: 'x_823178_commissio.duplicate_detection_enabled',
        value: 'true',
        description: 'Enable duplicate detection and prevention (default: true)',
        type: 'boolean',
        suffix: 'Commission Management'
    }
})

// BUSINESS REQUIREMENT: Emergency override capabilities
Record({
    $id: Now.ID['emergency_statement_override_prop'],
    table: 'sys_properties',
    data: {
        name: 'x_823178_commissio.emergency_statement_override',
        value: 'false',
        description: 'Emergency override for statement generation during freeze period (default: false)',
        type: 'boolean',
        suffix: 'Commission Management'
    }
})

Record({
    $id: Now.ID['high_value_auto_approval_prop'],
    table: 'sys_properties',
    data: {
        name: 'x_823178_commissio.high_value_auto_approval',
        value: 'false',
        description: 'Automatically approve high-value transactions (default: false - requires manual approval)',
        type: 'boolean',
        suffix: 'Commission Management'
    }
})

Record({
    $id: Now.ID['exception_sla_hours_prop'],
    table: 'sys_properties',
    data: {
        name: 'x_823178_commissio.exception_sla_hours',
        value: '48',
        description: 'SLA for resolving exception queue items (default: 48 hours)',
        type: 'integer',
        suffix: 'Commission Management'
    }
})

Record({
    $id: Now.ID['business_override_enabled_prop'],
    table: 'sys_properties',
    data: {
        name: 'x_823178_commissio.business_override_enabled',
        value: 'true',
        description: 'Enable business override capabilities for legitimate exceptions (default: true)',
        type: 'boolean',
        suffix: 'Commission Management'
    }
})

Record({
    $id: Now.ID['payout_schedule_mode_prop'],
    table: 'sys_properties',
    data: {
        name: 'x_823178_commissio.payout_schedule_mode',
        value: 'cycle',
        description: 'Commission payout scheduling mode: cycle (pay-cycle based) or days (fixed delay)',
        type: 'string',
        suffix: 'Commission Management'
    }
})

Record({
    $id: Now.ID['pay_cycle_days_prop'],
    table: 'sys_properties',
    data: {
        name: 'x_823178_commissio.pay_cycle_days',
        value: '14',
        description: 'Length of payroll cycle in days for cycle payout mode (default: 14)',
        type: 'integer',
        suffix: 'Commission Management'
    }
})

Record({
    $id: Now.ID['pay_cycles_after_payment_prop'],
    table: 'sys_properties',
    data: {
        name: 'x_823178_commissio.pay_cycles_after_payment',
        value: '2',
        description: 'Number of pay cycles after payment before commission becomes payout-eligible (default: 2)',
        type: 'integer',
        suffix: 'Commission Management'
    }
})

Record({
    $id: Now.ID['pay_cycle_anchor_date_prop'],
    table: 'sys_properties',
    data: {
        name: 'x_823178_commissio.pay_cycle_anchor_date',
        value: '2026-01-01',
        description: 'Anchor date for pay-cycle boundaries in cycle payout mode (YYYY-MM-DD)',
        type: 'string',
        suffix: 'Commission Management'
    }
})

Record({
    $id: Now.ID['payout_wait_days_prop'],
    table: 'sys_properties',
    data: {
        name: 'x_823178_commissio.payout_wait_days',
        value: '28',
        description: 'Fixed wait days after payment in days payout mode (default: 28)',
        type: 'integer',
        suffix: 'Commission Management'
    }
})

Record({
    $id: Now.ID['payout_backfill_limit_prop'],
    table: 'sys_properties',
    data: {
        name: 'x_823178_commissio.payout_backfill_limit',
        value: '5000',
        description: 'Maximum commission calculations updated per backfill run (default: 5000)',
        type: 'integer',
        suffix: 'Commission Management'
    }
})

Record({
    $id: Now.ID['payout_backfill_recompute_existing_prop'],
    table: 'sys_properties',
    data: {
        name: 'x_823178_commissio.payout_backfill_recompute_existing',
        value: 'false',
        description: 'When true, backfill recalculates payout eligibility for rows that already have payout_eligible_date',
        type: 'boolean',
        suffix: 'Commission Management'
    }
})