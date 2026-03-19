import '@servicenow/sdk/global'
import { Acl } from '@servicenow/sdk/core'
import { commissionRepRole, commissionAdminRole, commissionFinanceRole } from '../roles/commission-roles.now'

// Commission Plans - Role-aware read scope
Acl({
    $id: Now.ID['commission_plans_read_acl'],
    type: 'record',
    table: 'x_823178_commissio_commission_plans',
    operation: 'read',
    roles: [
        commissionAdminRole,
        commissionFinanceRole,
        {
            name: 'x_823178_commissio.manager',
            assignable_by: '',
            can_delegate: false,
            description: 'Commission managers can view direct-report performance and team rollups',
            elevated_privilege: false,
            grantable: true,
            scoped_admin: false,
            suffix: 'manager',
        },
        {
            name: 'x_823178_commissio.rep',
            assignable_by: '',
            can_delegate: false,
            description: 'Sales representatives can view their own commission calculations and statements',
            elevated_privilege: false,
            grantable: true,
            scoped_admin: false,
            suffix: 'rep',
        },
    ],
    active: true,
    adminOverrides: true,
    script: `
        if (gs.hasRole('x_823178_commissio.admin') || gs.hasRole('admin') || gs.hasRole('x_823178_commissio.finance')) {
            answer = true;
        } else {
            var viewerId = gs.getUserID();
            var repId = current.getValue('sales_rep');
            answer = false;

            if (repId && String(repId) === String(viewerId)) {
                answer = true;
            } else if (gs.hasRole('x_823178_commissio.manager') && repId) {
                var today = new GlideDateTime().getValue().substring(0, 10);
                var membershipGr = new GlideRecord('x_823178_commissio_manager_team_memberships');
                membershipGr.addQuery('manager_user', viewerId);
                membershipGr.addQuery('sales_rep', repId);
                membershipGr.addQuery('is_active', true);
                membershipGr.addQuery('effective_start_date', '<=', today);
                membershipGr.addNullQuery('effective_end_date').addOrCondition('effective_end_date', '>=', today);
                membershipGr.setLimit(1);
                membershipGr.query();
                if (membershipGr.next()) {
                    answer = true;
                } else {
                    var userGr = new GlideRecord('sys_user');
                    userGr.addQuery('sys_id', repId);
                    userGr.addQuery('manager', viewerId);
                    userGr.addActiveQuery();
                    userGr.setLimit(1);
                    userGr.query();
                    answer = userGr.next();
                }
            }
        }
    `,
    description:
        'Admins/finance can read all plans; reps read their own plans; managers read plans for their governed reps',
})

Acl({
    $id: Now.ID['commission_plans_write_acl'],
    type: 'record',
    table: 'x_823178_commissio_commission_plans',
    operation: 'write',
    roles: [commissionAdminRole],
    active: true,
    adminOverrides: true,
    description: 'Only commission admins can modify commission plans',
})

// Deals - Admin and Rep (own records)
Acl({
    $id: Now.ID['deals_read_acl'],
    type: 'record',
    table: 'x_823178_commissio_deals',
    operation: 'read',
    roles: [commissionAdminRole, commissionRepRole],
    active: true,
    adminOverrides: true,
    script: `
        // Reps can only see their own deals
        if (gs.hasRole('x_823178_commissio.rep') && !gs.hasRole('x_823178_commissio.admin')) {
            answer = current.current_owner == gs.getUserID() || current.owner_at_close == gs.getUserID();
        } else {
            answer = true;
        }
    `,
    description: 'Reps can read their own deals, admins can read all',
})

Acl({
    $id: Now.ID['deals_write_acl'],
    type: 'record',
    table: 'x_823178_commissio_deals',
    operation: 'write',
    roles: [commissionAdminRole],
    active: true,
    adminOverrides: true,
    description: 'Only admins can modify deals (sync process)',
})

// Commission Calculations - Admin and Rep (own records)
Acl({
    $id: Now.ID['commission_calc_read_acl'],
    type: 'record',
    table: 'x_823178_commissio_commission_calculations',
    operation: 'read',
    roles: [commissionAdminRole, commissionRepRole, commissionFinanceRole],
    active: true,
    adminOverrides: true,
    script: `
        // Reps can only see their own commission calculations
        if (gs.hasRole('x_823178_commissio.rep') && !gs.hasRole('x_823178_commissio.admin') && !gs.hasRole('x_823178_commissio.finance')) {
            answer = current.sales_rep == gs.getUserID();
        } else {
            answer = true;
        }
    `,
    description: 'Reps can read their own calculations, admins and finance can read all',
})

Acl({
    $id: Now.ID['commission_calc_write_acl'],
    type: 'record',
    table: 'x_823178_commissio_commission_calculations',
    operation: 'write',
    roles: [commissionAdminRole],
    active: true,
    adminOverrides: true,
    description: 'Only admins can modify commission calculations',
})

// Commission Statements - Admin, Finance, and Rep (own records)
Acl({
    $id: Now.ID['commission_stmt_read_acl'],
    type: 'record',
    table: 'x_823178_commissio_commission_statements',
    operation: 'read',
    roles: [commissionAdminRole, commissionRepRole, commissionFinanceRole],
    active: true,
    adminOverrides: true,
    script: `
        // Reps can only see their own statements
        if (gs.hasRole('x_823178_commissio.rep') && !gs.hasRole('x_823178_commissio.admin') && !gs.hasRole('x_823178_commissio.finance')) {
            answer = current.sales_rep == gs.getUserID();
        } else {
            answer = true;
        }
    `,
    description: 'Reps can read their own statements, admins and finance can read all',
})

Acl({
    $id: Now.ID['commission_stmt_write_acl'],
    type: 'record',
    table: 'x_823178_commissio_commission_statements',
    operation: 'write',
    roles: [commissionAdminRole, commissionFinanceRole],
    active: true,
    adminOverrides: true,
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
    description: 'Admins can modify all fields, finance can only update payment status',
})

// Invoices and Payments - Admin only (system sync)
Acl({
    $id: Now.ID['invoices_read_acl'],
    type: 'record',
    table: 'x_823178_commissio_invoices',
    operation: 'read',
    roles: [commissionAdminRole],
    active: true,
    adminOverrides: true,
    description: 'Only admins can read invoices',
})

Acl({
    $id: Now.ID['payments_read_acl'],
    type: 'record',
    table: 'x_823178_commissio_payments',
    operation: 'read',
    roles: [commissionAdminRole],
    active: true,
    adminOverrides: true,
    description: 'Only admins can read payments',
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
    description: 'Only commission admins can read governed deal type records',
})

Acl({
    $id: 'deal_types_write_acl',
    type: 'record',
    table: 'x_823178_commissio_deal_types',
    operation: 'write',
    roles: [commissionAdminRole],
    active: true,
    admin_overrides: true,
    description: 'Only commission admins can create/update/deactivate deal type records',
})

Acl({
    $id: 'deal_classifications_read_acl',
    type: 'record',
    table: 'x_823178_commissio_deal_classifications',
    operation: 'read',
    roles: [commissionAdminRole, commissionFinanceRole],
    active: true,
    admin_overrides: true,
    description: 'Only commission admins and finance can read deal classification mappings',
})

Acl({
    $id: 'deal_classifications_write_acl',
    type: 'record',
    table: 'x_823178_commissio_deal_classifications',
    operation: 'write',
    roles: [commissionAdminRole],
    active: true,
    admin_overrides: true,
    description: 'Only commission admins can manage deal classification mappings',
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
    description: 'Only commission admins can read plan recognition policy records',
})

Acl({
    $id: 'plan_recognition_policies_write_acl',
    type: 'record',
    table: 'x_823178_commissio_plan_recognition_policies',
    operation: 'write',
    roles: [commissionAdminRole],
    active: true,
    admin_overrides: true,
    description: 'Only commission admins can create/update recognition basis policies',
})

// Plan setup hierarchy children - role-aware read scope
Acl({
    $id: 'plan_targets_read_acl',
    type: 'record',
    table: 'x_823178_commissio_plan_targets',
    operation: 'read',
    roles: [commissionAdminRole, commissionFinanceRole, commissionRepRole],
    active: true,
    admin_overrides: true,
    script: `
        if (gs.hasRole('x_823178_commissio.admin') || gs.hasRole('admin') || gs.hasRole('x_823178_commissio.finance')) {
            answer = true;
        } else {
            answer = false;
            var viewerId = gs.getUserID();
            var planId = current.getValue('commission_plan');
            if (planId) {
                var planGr = new GlideRecord('x_823178_commissio_commission_plans');
                if (planGr.get(planId)) {
                    var repId = planGr.getValue('sales_rep');
                    if (repId && String(repId) === String(viewerId)) {
                        answer = true;
                    } else if (gs.hasRole('x_823178_commissio.manager') && repId) {
                        var today = new GlideDateTime().getValue().substring(0, 10);
                        var membershipGr = new GlideRecord('x_823178_commissio_manager_team_memberships');
                        membershipGr.addQuery('manager_user', viewerId);
                        membershipGr.addQuery('sales_rep', repId);
                        membershipGr.addQuery('is_active', true);
                        membershipGr.addQuery('effective_start_date', '<=', today);
                        membershipGr.addNullQuery('effective_end_date').addOrCondition('effective_end_date', '>=', today);
                        membershipGr.setLimit(1);
                        membershipGr.query();
                        if (membershipGr.next()) {
                            answer = true;
                        }
                    }
                }
            }
        }
    `,
    description: 'Admins/finance can read all targets; reps and managers can read targets for accessible plans',
})

Acl({
    $id: 'plan_targets_write_acl',
    type: 'record',
    table: 'x_823178_commissio_plan_targets',
    operation: 'write',
    roles: [commissionAdminRole],
    active: true,
    admin_overrides: true,
    description: 'Only commission admins can create/update plan target records',
})

Acl({
    $id: 'plan_tiers_read_acl',
    type: 'record',
    table: 'x_823178_commissio_plan_tiers',
    operation: 'read',
    roles: [commissionAdminRole, commissionFinanceRole, commissionRepRole],
    active: true,
    admin_overrides: true,
    script: `
        if (gs.hasRole('x_823178_commissio.admin') || gs.hasRole('admin') || gs.hasRole('x_823178_commissio.finance')) {
            answer = true;
        } else {
            answer = false;
            var viewerId = gs.getUserID();
            var planId = current.getValue('commission_plan');
            if (planId) {
                var planGr = new GlideRecord('x_823178_commissio_commission_plans');
                if (planGr.get(planId)) {
                    var repId = planGr.getValue('sales_rep');
                    if (repId && String(repId) === String(viewerId)) {
                        answer = true;
                    } else if (gs.hasRole('x_823178_commissio.manager') && repId) {
                        var today = new GlideDateTime().getValue().substring(0, 10);
                        var membershipGr = new GlideRecord('x_823178_commissio_manager_team_memberships');
                        membershipGr.addQuery('manager_user', viewerId);
                        membershipGr.addQuery('sales_rep', repId);
                        membershipGr.addQuery('is_active', true);
                        membershipGr.addQuery('effective_start_date', '<=', today);
                        membershipGr.addNullQuery('effective_end_date').addOrCondition('effective_end_date', '>=', today);
                        membershipGr.setLimit(1);
                        membershipGr.query();
                        if (membershipGr.next()) {
                            answer = true;
                        }
                    }
                }
            }
        }
    `,
    description: 'Admins/finance can read all tiers; reps and managers can read tiers for accessible plans',
})

Acl({
    $id: 'plan_tiers_write_acl',
    type: 'record',
    table: 'x_823178_commissio_plan_tiers',
    operation: 'write',
    roles: [commissionAdminRole],
    active: true,
    admin_overrides: true,
    description: 'Only commission admins can create/update plan tier records',
})

Acl({
    $id: 'plan_bonuses_read_acl',
    type: 'record',
    table: 'x_823178_commissio_plan_bonuses',
    operation: 'read',
    roles: [commissionAdminRole, commissionFinanceRole, commissionRepRole],
    active: true,
    admin_overrides: true,
    script: `
        if (gs.hasRole('x_823178_commissio.admin') || gs.hasRole('admin') || gs.hasRole('x_823178_commissio.finance')) {
            answer = true;
        } else {
            answer = false;
            var viewerId = gs.getUserID();
            var planId = current.getValue('commission_plan');
            if (planId) {
                var planGr = new GlideRecord('x_823178_commissio_commission_plans');
                if (planGr.get(planId)) {
                    var repId = planGr.getValue('sales_rep');
                    if (repId && String(repId) === String(viewerId)) {
                        answer = true;
                    } else if (gs.hasRole('x_823178_commissio.manager') && repId) {
                        var today = new GlideDateTime().getValue().substring(0, 10);
                        var membershipGr = new GlideRecord('x_823178_commissio_manager_team_memberships');
                        membershipGr.addQuery('manager_user', viewerId);
                        membershipGr.addQuery('sales_rep', repId);
                        membershipGr.addQuery('is_active', true);
                        membershipGr.addQuery('effective_start_date', '<=', today);
                        membershipGr.addNullQuery('effective_end_date').addOrCondition('effective_end_date', '>=', today);
                        membershipGr.setLimit(1);
                        membershipGr.query();
                        if (membershipGr.next()) {
                            answer = true;
                        }
                    }
                }
            }
        }
    `,
    description: 'Admins/finance can read all bonuses; reps and managers can read bonuses for accessible plans',
})

Acl({
    $id: 'plan_bonuses_write_acl',
    type: 'record',
    table: 'x_823178_commissio_plan_bonuses',
    operation: 'write',
    roles: [commissionAdminRole],
    active: true,
    admin_overrides: true,
    description: 'Only commission admins can create/update plan bonus records',
})

// Bulk plan assignment runs - admin only
Acl({
    $id: 'bulk_plan_assignment_runs_read_acl',
    type: 'record',
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
    operation: 'read',
    roles: [commissionAdminRole],
    active: true,
    admin_overrides: true,
    description: 'Only commission admins can read bulk plan assignment run records',
})

Acl({
    $id: 'bulk_plan_assignment_runs_write_acl',
    type: 'record',
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
    operation: 'write',
    roles: [commissionAdminRole],
    active: true,
    admin_overrides: true,
    description: 'Only commission admins can execute bulk plan assignment runs',
})

// Manager Team Memberships governance
Acl({
    $id: 'manager_team_memberships_read_acl',
    type: 'record',
    table: 'x_823178_commissio_manager_team_memberships',
    operation: 'read',
    roles: [commissionAdminRole],
    active: true,
    admin_overrides: true,
    script: `
        if (gs.hasRole('x_823178_commissio.manager') && !gs.hasRole('x_823178_commissio.admin')) {
            answer = current.manager_user == gs.getUserID();
        } else {
            answer = true;
        }
    `,
    description: 'Admins can read all manager-team governance rows; managers can read their own scope',
})

Acl({
    $id: 'manager_team_memberships_write_acl',
    type: 'record',
    table: 'x_823178_commissio_manager_team_memberships',
    operation: 'write',
    roles: [commissionAdminRole],
    active: true,
    admin_overrides: true,
    description: 'Only commission admins can create/update manager-team governance rows',
})

// Bonus earnings - Admin/Finance and Rep (own records)
Acl({
    $id: 'bonus_earnings_read_acl',
    type: 'record',
    table: 'x_823178_commissio_bonus_earnings',
    operation: 'read',
    roles: [commissionAdminRole, commissionRepRole, commissionFinanceRole],
    active: true,
    admin_overrides: true,
    script: `
        if (gs.hasRole('x_823178_commissio.rep') && !gs.hasRole('x_823178_commissio.admin') && !gs.hasRole('x_823178_commissio.finance')) {
            answer = current.sales_rep == gs.getUserID();
        } else {
            answer = true;
        }
    `,
    description: 'Reps can read their own bonus earnings; admins and finance can read all',
})

Acl({
    $id: 'bonus_earnings_write_acl',
    type: 'record',
    table: 'x_823178_commissio_bonus_earnings',
    operation: 'write',
    roles: [commissionAdminRole],
    active: true,
    admin_overrides: true,
    description: 'Only commission admins can modify bonus earnings records',
})
