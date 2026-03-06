import { UiAction } from '@servicenow/sdk/core'

UiAction({
    $id: Now.ID['7d89b1b063f74e2eb06b03fe57d229b2'],
    table: 'x_823178_commissio_commission_statements',
    name: 'Open Statement Explainability',
    actionName: 'x_823178_commissio_open_statement_explai',
    form: {
        showButton: true,
        showLink: true,
        showContextMenu: true,
    },
    messages: [],
    condition: 'current.isValidRecord()',
    script: "action.setRedirectURL('/x_823178_commissio_statement_explainability.do?sysparm_statement_id=' + current.getUniqueValue());",
    order: 220,
    showUpdate: false,
    showInsert: false,
})
