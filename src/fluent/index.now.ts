import '@servicenow/sdk/global'

// Application Menu and Navigation
import './application-menu.now'

// Security and role model
import './roles/commission-roles.now'
import './acls/commission-security.now'

// System configuration
import './system-properties.now'

// Monitoring and operations tables
import './monitoring-tables.now'

// Commission Dashboard UI Page
import './ui-pages/commission-dashboard-redesigned.now'

// Sales Rep Commission Progress UI Page
import './ui-pages/commission-progress.now'

// Scheduled scripts
import './scheduled-scripts/monthly-statements.now'
import './scheduled-scripts/daily-reconciliation.now'
import './scheduled-scripts/backfill-payout-eligibility.now'

// Business rules
import './business-rules/deal-management.now'
import './business-rules/invoice-management.now'
import './business-rules/payment-commission.now'
import './business-rules/commission-plan-validation.now'
import './business-rules/statement-approval-workflow.now'

// Client-callable Script Includes
import './script-includes/commission-progress-helper.now'
import './script-includes/commission-p1-helper.now'

// Scripted REST APIs
import './scripted-rest-apis/zoho-integration.now'

// Core tables
import './tables/deals.now'
import './tables/invoices.now'
import './tables/payments.now'
import './tables/commission_plans.now'
import './tables/commission_calculations.now'
import './tables/commission_statements.now'
import './tables/statement_approvals.now'
import './tables/exception_approvals.now'
import './tables/forecast_scenarios.now'

// Plan configuration tables
import './tables/plan_targets.now'
import './tables/plan_tiers.now'
import './tables/plan_bonuses.now'

// Demo Data
import './compensation-demo-data.now'
import './enhanced-demo-data.now'
import './sample-data.now'
import './test-payments.now'