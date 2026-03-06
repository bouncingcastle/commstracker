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
import './ui-pages/plan-structure-hierarchy.now'

// Sales Rep Commission Progress UI Page
import './ui-pages/commission-progress.now'

// Scheduled scripts
import './scheduled-scripts/monthly-statements.now'
import './scheduled-scripts/daily-reconciliation.now'
import './scheduled-scripts/backfill-payout-eligibility.now'
import './scheduled-scripts/backfill-tier-and-deal-classifications.now'
import './scheduled-scripts/backfill-deal-type-references.now'
import './scheduled-scripts/seed-governance-reconcile.now'
import './scheduled-scripts/architecture-integrity-check.now'
import './scheduled-scripts/production-mvp-readiness-check.now'
import './scheduled-scripts/month-end-readiness-audit.now'
import './scheduled-scripts/seed-bonus-scenarios.now'

// Business rules
import './business-rules/deal-management.now'
import './business-rules/invoice-management.now'
import './business-rules/payment-commission.now'
import './business-rules/commission-plan-validation.now'
import './business-rules/plan-target-validation.now'
import './business-rules/plan-tier-validation.now'
import './business-rules/deal-type-validation.now'
import './business-rules/deal-classification-validation.now'
import './business-rules/deal-type-governance.now'
import './business-rules/plan-recognition-policy-validation.now'
import './business-rules/bulk-plan-assignment.now'
import './business-rules/manager-team-governance.now'
import './business-rules/statement-approval-workflow.now'
import './business-rules/plan-bonus-validation.now'

// Client-callable Script Includes
import './script-includes/commission-progress-helper.now'

// Scripted REST APIs
import './scripted-rest-apis/zoho-integration.now'

// Core tables
import './tables/deals.now'
import './tables/invoices.now'
import './tables/payments.now'
import './tables/commission_plans.now'
import './tables/deal_types.now'
import './tables/deal_classifications.now'
import './tables/plan_recognition_policies.now'
import './tables/commission_calculations.now'
import './tables/commission_statements.now'
import './tables/statement_approvals.now'
import './tables/bulk_plan_assignment_runs.now'
import './tables/manager_team_memberships.now'
import './tables/exception_approvals.now'
import './tables/forecast_scenarios.now'
import './tables/bonus_earnings.now'

// Plan configuration tables
import './tables/plan_targets.now'
import './tables/plan_tiers.now'
import './tables/plan_bonuses.now'

// Form UX (single-flow plan setup)
import './form-related-lists.now'
import './plan-form-actions.now'
import './commission-plan-form-layout.now'
import './commission-calculation-form-layout.now'
import './plan-target-form-layout.now'
import './plan-tier-form-layout.now'
import './plan-bonus-form-layout.now'
import './plan-recognition-policy-form-layout.now'

// Configuration seed data
import './deal-types-data.now'

// Demo Data
// import './compensation-demo-data.now' // Temporarily disabled to prevent duplicate demo records
// import './enhanced-demo-data.now' // Temporarily disabled to prevent duplicate demo records
// import './sample-data.now' // Temporarily disabled to prevent duplicate demo records
// import './test-payments.now' // Temporarily disabled to prevent duplicate demo records