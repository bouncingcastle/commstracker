import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import { calculateCommissionOnPayment, validatePaymentData } from '../../server/business-rules/payment-commission.js'

// Business rule to calculate commission on payment
BusinessRule({
    $id: Now.ID['payment_commission_calc'],
    name: 'Commission Calculation on Payment',
    table: 'x_823178_commissio_payments',
    action: ['update', 'insert'],
    when: 'after',
    script: calculateCommissionOnPayment,
    active: true,
    order: 200,
    description: 'Calculates commission when payment is received',
})

// Business rule to validate payment data
BusinessRule({
    $id: Now.ID['payment_validation'],
    name: 'Payment Validation',
    table: 'x_823178_commissio_payments',
    action: ['update', 'insert'],
    when: 'before',
    script: validatePaymentData,
    active: true,
    order: 50,
    description: 'Validates payment data integrity',
})
