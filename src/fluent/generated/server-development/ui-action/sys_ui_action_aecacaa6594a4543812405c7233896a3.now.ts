import { UiAction } from '@servicenow/sdk/core'

UiAction({
    $id: Now.ID['aecacaa6594a4543812405c7233896a3'],
    table: 'x_823178_commissio_commission_plans',
    name: 'Open Plan Hierarchy',
    actionName: 'x_823178_commissio_open_plan_hierarchy',
    form: {
        showButton: true,
        showLink: true,
        showContextMenu: true,
    },
    messages: [],
    condition: 'current.isValidRecord()',
    script: "action.setRedirectURL('/x_823178_commissio_plan_hierarchy.do?sysparm_plan_id=' + current.getUniqueValue());",
    order: 200,
    showUpdate: false,
    showInsert: false,
})
