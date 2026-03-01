import '@servicenow/sdk/global'
import { Table, StringColumn, DateTimeColumn, DecimalColumn, ReferenceColumn } from '@servicenow/sdk/core'

// Exception Approvals table with web service access
export const x_823178_commissio_exception_approvals = Table({
    name: 'x_823178_commissio_exception_approvals',
    label: 'Exception Approvals',
    schema: {
        request_type: StringColumn({ 
            label: 'Request Type',
            choices: {
                high_value_deal: { label: 'High Value Deal', sequence: 0 },
                high_value_payment: { label: 'High Value Payment', sequence: 1 },
                high_value_commission: { label: 'High Value Commission', sequence: 2 },
                snapshot_correction: { label: 'Snapshot Correction', sequence: 3 },
                plan_overlap: { label: 'Plan Overlap', sequence: 4 },
                retroactive_change: { label: 'Retroactive Change', sequence: 5 },
                deal_type_deprecation: { label: 'Deal Type Deprecation', sequence: 6 },
                recognition_policy_overlap: { label: 'Recognition Policy Overlap', sequence: 7 },
                recognition_policy_change: { label: 'Recognition Policy Change', sequence: 8 }
            },
            mandatory: true
        }),
        reference_record: StringColumn({ 
            label: 'Reference Record ID',
            maxLength: 50,
            mandatory: true
        }),
        reference_table: StringColumn({ 
            label: 'Reference Table',
            maxLength: 50,
            mandatory: true
        }),
        requested_by: ReferenceColumn({ 
            label: 'Requested By',
            referenceTable: 'sys_user',
            mandatory: true
        }),
        request_date: DateTimeColumn({ 
            label: 'Request Date',
            mandatory: true
        }),
        business_justification: StringColumn({ 
            label: 'Business Justification',
            maxLength: 2000,
            mandatory: true
        }),
        requested_amount: DecimalColumn({ 
            label: 'Requested Amount'
        }),
        current_amount: DecimalColumn({ 
            label: 'Current Amount'
        }),
        variance_amount: DecimalColumn({ 
            label: 'Variance Amount'
        }),
        status: StringColumn({ 
            label: 'Status',
            choices: {
                pending: { label: 'Pending Review', sequence: 0 },
                approved: { label: 'Approved', sequence: 1 },
                rejected: { label: 'Rejected', sequence: 2 },
                implemented: { label: 'Implemented', sequence: 3 }
            },
            default: 'pending'
        }),
        approved_by: ReferenceColumn({ 
            label: 'Approved By',
            referenceTable: 'sys_user'
        }),
        approval_date: DateTimeColumn({ 
            label: 'Approval Date'
        }),
        rejection_reason: StringColumn({ 
            label: 'Rejection Reason',
            maxLength: 1000
        }),
        implemented_by: ReferenceColumn({ 
            label: 'Implemented By',
            referenceTable: 'sys_user'
        }),
        implementation_date: DateTimeColumn({ 
            label: 'Implementation Date'
        }),
        audit_notes: StringColumn({ 
            label: 'Audit Notes',
            maxLength: 2000
        })
    },
    audit: true,
    accessible_from: 'public',
    caller_access: 'tracking',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true
})