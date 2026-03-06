import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['bec39b58360445cdbb53a9daef55fb63'],
    table: 'sys_app_module',
    data: {
        active: true,
        application: '9f26a2fe5dcd472493e2947fc9afad2c',
        hint: 'Open individual active plans by rep and review full plan structure via related lists',
        link_type: 'DIRECT',
        order: 34.1,
        override_menu_roles: false,
        query: 'x_823178_commissio_commission_plans_list.do?sysparm_query=is_active=true^ORDERBYsales_rep^ORDERBYDESCeffective_start_date',
        require_confirmation: false,
        sys_domain: 'global',
        sys_domain_path: '/',
        title: 'Plan Structure Reference',
        uncancelable: false,
    },
})
