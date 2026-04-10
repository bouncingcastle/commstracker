import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: 'commission_statement_open_explainability_action',
    table: 'sys_ui_action',
    data: {
        name: 'Open Statement Explainability',
        action_name: 'x_823178_commissio_open_statement_explainability',
        table: 'x_823178_commissio_commission_statements',
        active: true,
        order: 220,
        form_button: true,
        form_link: true,
        form_context_menu: true,
        client: false,
        condition: 'current.isValidRecord()',
        script: "action.setRedirectURL('/x_823178_commissio_statement_explainability.do?sysparm_statement_id=' + current.getUniqueValue());"
    }
})
