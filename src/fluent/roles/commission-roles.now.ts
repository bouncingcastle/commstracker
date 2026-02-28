import '@servicenow/sdk/global'
import { Role } from '@servicenow/sdk/core'

// Sales Rep role - can view own commission data
export const commissionRepRole = Role({
    name: 'x_823178_commissio.rep',
    description: 'Sales representatives can view their own commission calculations and statements',
    can_delegate: false,
    grantable: true
})

// Commission Admin role - can manage all commission data
export const commissionAdminRole = Role({
    name: 'x_823178_commissio.admin',
    description: 'Commission administrators can manage all commission data, plans, and calculations',
    can_delegate: false,
    grantable: true,
    contains_roles: [commissionRepRole]
})

// Finance role - can lock statements and mark as paid
export const commissionFinanceRole = Role({
    name: 'x_823178_commissio.finance',
    description: 'Finance team can lock statements, mark as paid, and access financial reports',
    can_delegate: false,
    grantable: true
})