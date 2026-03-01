import '@servicenow/sdk/global'
import { Acl } from '@servicenow/sdk/core'
import { commissionRepRole, commissionAdminRole, commissionFinanceRole } from '../roles/commission-roles.now'

// Commission Plans - Admin only
Acl({
    $id: Now.ID['commission_plans_read_acl'],
    type: 'record',
    table: 'x_823178_commissio_commission_plans',
    operation: 'read',
    roles: [commissionAdminRole],
    active: true,
    admin_overrides: true,
    description: 'Only commission admins can read commission plans'
})

Acl({
    $id: Now.ID['commission_plans_write_acl'],
    type: 'record',
    table: 'x_823178_commissio_commission_plans',
    operation: 'write',
    roles: [commissionAdminRole],
    active: true,
    admin_overrides: true,
    description: 'Only commission admins can modify commission plans'
})

// Deals - Admin and Rep (own records)
Acl({
    $id: Now.ID['deals_read_acl'],
    type: 'record',
    table: 'x_823178_commissio_deals',
    operation: 'read',
    roles: [commissionAdminRole, commissionRepRole],
    active: true,
    admin_overrides: true,
    script: `
        // Reps can only see their own deals
        if (gs.hasRole('x_823178_commissio.rep') && !gs.hasRole('x_823178_commissio.admin')) {
            answer = current.current_owner == gs.getUserID() || current.owner_at_close == gs.getUserID();
        } else {
            answer = true;
        }
    `,
    description: 'Reps can read their own deals, admins can read all'
})

Acl({
    $id: Now.ID['deals_write_acl'],
    type: 'record',
    table: 'x_823178_commissio_deals',
    operation: 'write',
    roles: [commissionAdminRole],
    active: true,
    admin_overrides: true,
    description: 'Only admins can modify deals (sync process)'
})

// Commission Calculations - Admin and Rep (own records)
Acl({
    $id: Now.ID['commission_calc_read_acl'],
    type: 'record',
    table: 'x_823178_commissio_commission_calculations',
    operation: 'read',
    roles: [commissionAdminRole, commissionRepRole, commissionFinanceRole],
    active: true,
    admin_overrides: true,
    script: `
        // Reps can only see their own commission calculations
        if (gs.hasRole('x_823178_commissio.rep') && !gs.hasRole('x_823178_commissio.admin') && !gs.hasRole('x_823178_commissio.finance')) {
            answer = current.sales_rep == gs.getUserID();
        } else {
            answer = true;
        }
    `,
    description: 'Reps can read their own calculations, admins and finance can read all'
})

Acl({
    $id: Now.ID['commission_calc_write_acl'],
    type: 'record',
    table: 'x_823178_commissio_commission_calculations',
    operation: 'write',
    roles: [commissionAdminRole],
    active: true,
    admin_overrides: true,
    description: 'Only admins can modify commission calculations'
})

// Commission Statements - Admin, Finance, and Rep (own records)
Acl({
    $id: Now.ID['commission_stmt_read_acl'],
    type: 'record',
    table: 'x_823178_commissio_commission_statements',
    operation: 'read',
    roles: [commissionAdminRole, commissionRepRole, commissionFinanceRole],
    active: true,
    admin_overrides: true,
    script: `
        // Reps can only see their own statements
        if (gs.hasRole('x_823178_commissio.rep') && !gs.hasRole('x_823178_commissio.admin') && !gs.hasRole('x_823178_commissio.finance')) {
            answer = current.sales_rep == gs.getUserID();
        } else {
            answer = true;
        }
    `,
    description: 'Reps can read their own statements, admins and finance can read all'
})

Acl({
    $id: Now.ID['commission_stmt_write_acl'],
    type: 'record',
    table: 'x_823178_commissio_commission_statements',
    operation: 'write',
    roles: [commissionAdminRole, commissionFinanceRole],
    active: true,
    admin_overrides: true,
    script: `
        // Finance can only change status fields (lock/pay)
        if (gs.hasRole('x_823178_commissio.finance') && !gs.hasRole('x_823178_commissio.admin')) {
            // Allow finance to update specific fields only
            if (current.status.changes() || current.locked_date.changes() || current.locked_by.changes() || 
                current.paid_date.changes() || current.paid_by.changes() || current.payment_reference.changes()) {
                answer = true;
            } else {
                answer = false;
            }
        } else {
            answer = true; // Admins can modify everything
        }
    `,
    description: 'Admins can modify all fields, finance can only update payment status'
})

// Invoices and Payments - Admin only (system sync)
Acl({
    $id: Now.ID['invoices_read_acl'],
    type: 'record',
    table: 'x_823178_commissio_invoices',
    operation: 'read',
    roles: [commissionAdminRole],
    active: true,
    admin_overrides: true,
    description: 'Only admins can read invoices'
})

Acl({
    $id: Now.ID['payments_read_acl'],
    type: 'record',
    table: 'x_823178_commissio_payments',
    operation: 'read',
    roles: [commissionAdminRole],
    active: true,
    admin_overrides: true,
    description: 'Only admins can read payments'
})

// Deal Types governance - admin only
Acl({
    $id: 'deal_types_read_acl',
    type: 'record',
    table: 'x_823178_commissio_deal_types',
    operation: 'read',
    roles: [commissionAdminRole],
    active: true,
    admin_overrides: true,
    description: 'Only commission admins can read governed deal type records'
})

Acl({
    $id: 'deal_types_write_acl',
    type: 'record',
    table: 'x_823178_commissio_deal_types',
    operation: 'write',
    roles: [commissionAdminRole],
    active: true,
    admin_overrides: true,
    description: 'Only commission admins can create/update/deactivate deal type records'
})

// Plan Recognition Policies governance - admin only
Acl({
    $id: 'plan_recognition_policies_read_acl',
    type: 'record',
    table: 'x_823178_commissio_plan_recognition_policies',
    operation: 'read',
    roles: [commissionAdminRole],
    active: true,
    admin_overrides: true,
    description: 'Only commission admins can read plan recognition policy records'
})

Acl({
    $id: 'plan_recognition_policies_write_acl',
    type: 'record',
    table: 'x_823178_commissio_plan_recognition_policies',
    operation: 'write',
    roles: [commissionAdminRole],
    active: true,
    admin_overrides: true,
    description: 'Only commission admins can create/update recognition basis policies'
})