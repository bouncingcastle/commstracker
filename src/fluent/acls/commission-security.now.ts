import '@servicenow/sdk/global'

// ACL Security Model for Commission Management
//
// ServiceNow ACLs are managed in-instance, not via the fluent SDK.
// This file documents the intended access control rules that must be
// configured in the target instance after deployment.
//
// Table-level ACL requirements:
//
// x_823178_commissio_deals
//   read:  rep (own), manager (team), finance, admin
//   write: admin only (data ingested via integration)
//
// x_823178_commissio_invoices
//   read:  rep (own deals), manager (team), finance, admin
//   write: admin only
//
// x_823178_commissio_payments
//   read:  rep (own deals), manager (team), finance, admin
//   write: admin only
//
// x_823178_commissio_commission_plans
//   read:  rep (own), manager (team), finance, admin
//   write: admin only
//
// x_823178_commissio_commission_calculations
//   read:  rep (own), manager (team), finance, admin
//   write: admin only (system-generated)
//
// x_823178_commissio_commission_statements
//   read:  rep (own), manager (team), finance, admin
//   write: finance (status transitions), admin
//
// x_823178_commissio_statement_approvals
//   read:  finance, admin
//   write: finance (approval actions), admin
//
// x_823178_commissio_exception_approvals
//   read:  finance, admin
//   write: finance, admin
//
// x_823178_commissio_system_alerts
//   read:  admin
//   write: admin (system-generated)
//
// x_823178_commissio_reconciliation_log
//   read:  admin
//   write: admin (system-generated)
//
// Role hierarchy:
//   admin contains rep (inherits rep visibility)
//   manager uses team membership table for scoped access
//   finance has global read on financial tables + write on statement status
//   rep sees only own records (filtered by sales_rep = current user)
