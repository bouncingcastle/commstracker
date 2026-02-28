import '@servicenow/sdk/global'
import { Table, StringColumn, DateTimeColumn, IntegerColumn } from '@servicenow/sdk/core'

// Monitoring tables with web service access
export const x_823178_commissio_reconciliation_log = Table({
    name: 'x_823178_commissio_reconciliation_log',
    label: 'Reconciliation Log',
    schema: {
        reconciliation_date: DateTimeColumn({ 
            label: 'Reconciliation Date',
            mandatory: true
        }),
        records_checked: IntegerColumn({ 
            label: 'Records Checked'
        }),
        total_variances: IntegerColumn({ 
            label: 'Total Variances'
        }),
        significant_variances: IntegerColumn({ 
            label: 'Significant Variances'
        }),
        errors_found: IntegerColumn({ 
            label: 'Errors Found'
        }),
        warnings_found: IntegerColumn({ 
            label: 'Warnings Found'
        }),
        status: StringColumn({ 
            label: 'Status',
            choices: {
                passed: { label: 'Passed', sequence: 0 },
                warning: { label: 'Warning', sequence: 1 },
                failed: { label: 'Failed', sequence: 2 }
            }
        }),
        processing_time_seconds: IntegerColumn({ 
            label: 'Processing Time (Seconds)'
        }),
        details: StringColumn({ 
            label: 'Details',
            maxLength: 4000
        })
    },
    audit: true,
    accessible_from: 'public',
    caller_access: 'tracking',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true
})

// System Alerts table with web service access
export const x_823178_commissio_system_alerts = Table({
    name: 'x_823178_commissio_system_alerts',
    label: 'System Alerts',
    schema: {
        title: StringColumn({ 
            label: 'Alert Title',
            mandatory: true,
            maxLength: 255
        }),
        message: StringColumn({ 
            label: 'Alert Message',
            maxLength: 4000
        }),
        severity: StringColumn({ 
            label: 'Severity',
            choices: {
                low: { label: 'Low', sequence: 0 },
                medium: { label: 'Medium', sequence: 1 },
                high: { label: 'High', sequence: 2 },
                critical: { label: 'Critical', sequence: 3 }
            }
        }),
        alert_date: DateTimeColumn({ 
            label: 'Alert Date',
            mandatory: true
        }),
        status: StringColumn({ 
            label: 'Status',
            choices: {
                open: { label: 'Open', sequence: 0 },
                acknowledged: { label: 'Acknowledged', sequence: 1 },
                resolved: { label: 'Resolved', sequence: 2 }
            },
            default: 'open'
        }),
        acknowledged_by: StringColumn({ 
            label: 'Acknowledged By',
            maxLength: 100
        }),
        acknowledged_date: DateTimeColumn({ 
            label: 'Acknowledged Date'
        }),
        resolved_by: StringColumn({ 
            label: 'Resolved By',
            maxLength: 100
        }),
        resolved_date: DateTimeColumn({ 
            label: 'Resolved Date'
        }),
        resolution_notes: StringColumn({ 
            label: 'Resolution Notes',
            maxLength: 1000
        })
    },
    audit: true,
    accessible_from: 'public',
    caller_access: 'tracking',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true
})