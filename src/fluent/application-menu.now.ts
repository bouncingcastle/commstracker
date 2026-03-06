import '@servicenow/sdk/global'
import { ApplicationMenu, Record } from '@servicenow/sdk/core'

// Create the main Commission Management application menu
const commissionApp = ApplicationMenu({
    $id: Now.ID['commission_app'],
    title: 'Commission Management',
    hint: 'Comprehensive commission tracking and management system',
    order: 100
})

// Dashboard Module - Main Landing Page
Record({
    $id: Now.ID['dashboard_module'],
    table: 'sys_app_module',
    data: {
        title: 'Dashboard',
        application: commissionApp.$id,
        link_type: 'DIRECT',
        query: 'x_823178_commissio_dashboard.do',
        hint: 'Commission management dashboard and overview',
        order: 5,
        active: true
    }
})

// My Progress Module - Sales Rep Personal View
Record({
    $id: Now.ID['progress_module'],
    table: 'sys_app_module',
    data: {
        title: 'My Progress',
        application: commissionApp.$id,
        link_type: 'DIRECT',
        query: 'x_823178_commissio_progress.do',
        hint: 'Track your earnings, pending amounts, and deal pipeline',
        order: 7,
        active: true
    }
})

// Data Management Separator
Record({
    $id: Now.ID['data_separator'],
    table: 'sys_app_module',
    data: {
        title: 'Data Management',
        application: commissionApp.$id,
        link_type: 'SEPARATOR',
        order: 20,
        active: true
    }
})

// Deals Module
Record({
    $id: Now.ID['deals_module'],
    table: 'sys_app_module',
    data: {
        title: 'Deals',
        application: commissionApp.$id,
        link_type: 'LIST',
        name: 'x_823178_commissio_deals',
        hint: 'View and manage deals from Zoho Bigin',
        order: 21,
        active: true
    }
})

// Invoices Module  
Record({
    $id: Now.ID['invoices_module'],
    table: 'sys_app_module',
    data: {
        title: 'Invoices',
        application: commissionApp.$id,
        link_type: 'LIST',
        name: 'x_823178_commissio_invoices',
        hint: 'View invoices from Zoho Books',
        order: 22,
        active: true
    }
})

// Payments Module
Record({
    $id: Now.ID['payments_module'],
    table: 'sys_app_module',
    data: {
        title: 'Payments',
        application: commissionApp.$id,
        link_type: 'LIST',
        name: 'x_823178_commissio_payments',
        hint: 'View payments from Zoho Books',
        order: 23,
        active: true
    }
})

// Commission Management Separator
Record({
    $id: Now.ID['commission_separator'],
    table: 'sys_app_module',
    data: {
        title: 'Commission Management',
        application: commissionApp.$id,
        link_type: 'SEPARATOR',
        order: 30,
        active: true
    }
})

// Commission Calculations Module
Record({
    $id: Now.ID['calculations_module'],
    table: 'sys_app_module',
    data: {
        title: 'Commission Calculations',
        application: commissionApp.$id,
        link_type: 'LIST',
        name: 'x_823178_commissio_commission_calculations',
        hint: 'View commission calculations and earnings',
        order: 31,
        active: true
    }
})

// Commission Plans Module
Record({
    $id: Now.ID['plans_module'],
    table: 'sys_app_module',
    data: {
        title: 'Commission Plans',
        application: commissionApp.$id,
        link_type: 'LIST',
        name: 'x_823178_commissio_commission_plans',
        hint: 'Manage commission plans and rates',
        order: 32,
        active: true
    }
})

// Plan Targets Module - Quota targets by deal type
Record({
    $id: Now.ID['plan_targets_module'],
    table: 'sys_app_module',
    data: {
        title: 'Plan Targets',
        application: commissionApp.$id,
        link_type: 'LIST',
        name: 'x_823178_commissio_plan_targets',
        hint: 'Configure annual quota targets per deal type',
        order: 32.1,
        active: true
    }
})

// Plan Tiers Module - Commission acceleration structure
Record({
    $id: Now.ID['plan_tiers_module'],
    table: 'sys_app_module',
    data: {
        title: 'Plan Tiers',
        application: commissionApp.$id,
        link_type: 'LIST',
        name: 'x_823178_commissio_plan_tiers',
        hint: 'Configure commission rate acceleration by quota attainment',
        order: 32.2,
        active: true
    }
})

// Plan Bonuses Module - Performance bonuses
Record({
    $id: Now.ID['plan_bonuses_module'],
    table: 'sys_app_module',
    data: {
        title: 'Plan Bonuses',
        application: commissionApp.$id,
        link_type: 'LIST',
        name: 'x_823178_commissio_plan_bonuses',
        hint: 'Configure discretionary and performance bonuses',
        order: 32.3,
        active: true
    }
})

// Deal Types Module - Governed taxonomy for plan/deal configuration
Record({
    $id: 'deal_types_module',
    table: 'sys_app_module',
    data: {
        title: 'Deal Types',
        application: commissionApp.$id,
        link_type: 'LIST',
        name: 'x_823178_commissio_deal_types',
        hint: 'Manage governed deal type taxonomy, lifecycle, and definitions',
        order: 32.35,
        active: true
    }
})

// Plan Recognition Policies Module - Versioned recognition basis policy by plan
Record({
    $id: 'plan_recognition_policies_module',
    table: 'sys_app_module',
    data: {
        title: 'Plan Recognition Policies',
        application: commissionApp.$id,
        link_type: 'LIST',
        name: 'x_823178_commissio_plan_recognition_policies',
        hint: 'Manage versioned recognition basis policies per commission plan',
        order: 32.4,
        active: true
    }
})

// Commission Statements Module
Record({
    $id: Now.ID['statements_module'],
    table: 'sys_app_module',
    data: {
        title: 'Commission Statements',
        application: commissionApp.$id,
        link_type: 'LIST',
        name: 'x_823178_commissio_commission_statements',
        hint: 'View monthly commission statements',
        order: 33,
        active: true
    }
})

// Forecast Scenarios Module
Record({
    $id: Now.ID['forecast_scenarios_module'],
    table: 'sys_app_module',
    data: {
        title: 'Forecast Scenarios',
        application: commissionApp.$id,
        link_type: 'LIST',
        name: 'x_823178_commissio_forecast_scenarios',
        hint: 'Create and compare saved forecast scenarios',
        order: 33.5,
        active: true
    }
})

// Statement Approvals Module
Record({
    $id: Now.ID['statement_approvals_module'],
    table: 'sys_app_module',
    data: {
        title: 'Statement Approvals',
        application: commissionApp.$id,
        link_type: 'LIST',
        name: 'x_823178_commissio_statement_approvals',
        hint: 'Manage statement approval workflow transitions',
        order: 33.6,
        active: true
    }
})

// Rep Compensation Management Module
Record({
    $id: Now.ID['compensation_management_module'],
    table: 'sys_app_module',
    data: {
        title: 'Plan Setup Form (Shortcut)',
        application: commissionApp.$id,
        link_type: 'DIRECT',
        query: 'x_823178_commissio_commission_plans.do?sys_id=-1&sysparm_view=default',
        hint: 'Shortcut to create a new plan and configure related lists from the plan form',
        order: 34,
        active: true
    }
})

Record({
    $id: 'plan_structure_reference_module',
    table: 'sys_app_module',
    data: {
        title: 'Plan Structure Reference',
        application: commissionApp.$id,
        link_type: 'DIRECT',
        query: 'x_823178_commissio_commission_plans_list.do?sysparm_query=is_active=true^ORDERBYsales_rep^ORDERBYDESCeffective_start_date',
        hint: 'Open individual active plans by rep and review full plan structure via related lists',
        order: 34.1,
        active: true
    }
})

// Bulk Plan Assignment Runs Module
Record({
    $id: 'bulk_plan_assignment_runs_module',
    table: 'sys_app_module',
    data: {
        title: 'Bulk Plan Assignments',
        application: commissionApp.$id,
        link_type: 'LIST',
        name: 'x_823178_commissio_bulk_plan_assignment_runs',
        hint: 'Run preview/apply/rollback bulk plan assignments with overlap safeguards',
        order: 34.2,
        active: true
    }
})

// Manager Team Governance Module
Record({
    $id: 'manager_team_memberships_module',
    table: 'sys_app_module',
    data: {
        title: 'Manager Team Governance',
        application: commissionApp.$id,
        link_type: 'LIST',
        name: 'x_823178_commissio_manager_team_memberships',
        hint: 'Define manager-to-rep governance scope and effective windows for team rollups',
        order: 34.3,
        active: true
    }
})

// Administration Separator
Record({
    $id: Now.ID['admin_separator'],
    table: 'sys_app_module',
    data: {
        title: 'Administration',
        application: commissionApp.$id,
        link_type: 'SEPARATOR',
        order: 40,
        active: true
    }
})

// Exception Approvals Module
Record({
    $id: Now.ID['exceptions_module'],
    table: 'sys_app_module',
    data: {
        title: 'Exception Approvals',
        application: commissionApp.$id,
        link_type: 'LIST',
        name: 'x_823178_commissio_exception_approvals',
        hint: 'Review and approve exception requests',
        order: 41,
        active: true
    }
})

// System Alerts Module
Record({
    $id: Now.ID['alerts_module'],
    table: 'sys_app_module',
    data: {
        title: 'System Alerts',
        application: commissionApp.$id,
        link_type: 'LIST',
        name: 'x_823178_commissio_system_alerts',
        hint: 'View system alerts and notifications',
        order: 42,
        active: true
    }
})

// Reconciliation Log Module
Record({
    $id: Now.ID['reconciliation_module'],
    table: 'sys_app_module',
    data: {
        title: 'Reconciliation Log',
        application: commissionApp.$id,
        link_type: 'LIST',
        name: 'x_823178_commissio_reconciliation_log',
        hint: 'View daily reconciliation and audit logs',
        order: 43,
        active: true
    }
})

// System Preferences Module
Record({
    $id: 'system_preferences_module',
    table: 'sys_app_module',
    data: {
        title: 'System Preferences',
        application: commissionApp.$id,
        link_type: 'DIRECT',
        query: 'sys_properties_list.do?sysparm_query=nameSTARTSWITHx_823178_commissio.',
        hint: 'Manage Commission Management system properties and operational settings',
        order: 44,
        active: true
    }
})