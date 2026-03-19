import '@servicenow/sdk/global'
import { Role } from '@servicenow/sdk/core'

// Sales Rep role - can view own commission data
export const commissionRepRole = Role({
    name: 'x_823178_commissio.rep',
    description: 'Sales representatives can view their own commission calculations and statements',
    canDelegate: false,
    grantable: true,
})

// Commission Admin role - can manage all commission data
export const commissionAdminRole = Role({
    name: 'x_823178_commissio.admin',
    description: 'Commission administrators can manage all commission data, plans, and calculations',
    canDelegate: false,
    grantable: true,
    containsRoles: [commissionRepRole],
})

// Manager role - can view own and direct reports rollups
// Finance role - can lock statements and mark as paid
export const commissionFinanceRole = Role({
    name: 'x_823178_commissio.finance',
    description: 'Finance team can lock statements, mark as paid, and access financial reports',
    canDelegate: false,
    grantable: true,
})
