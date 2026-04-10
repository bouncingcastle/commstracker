import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: 'commission_plan_open_hierarchy_action',
    table: 'sys_ui_action',
    data: {
        name: 'Open Plan Hierarchy',
        action_name: 'x_823178_commissio_open_plan_hierarchy',
        table: 'x_823178_commissio_commission_plans',
        active: true,
        order: 200,
        form_button: true,
        form_link: true,
        form_context_menu: true,
        client: false,
        condition: 'current.isValidRecord()',
        script: "action.setRedirectURL('/x_823178_commissio_plan_hierarchy.do?sysparm_plan_id=' + current.getUniqueValue());"
    }
})
