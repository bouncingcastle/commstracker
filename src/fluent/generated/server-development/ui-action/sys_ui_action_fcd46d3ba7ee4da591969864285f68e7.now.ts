import { UiAction } from '@servicenow/sdk/core'

UiAction({
    $id: Now.ID['fcd46d3ba7ee4da591969864285f68e7'],
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
