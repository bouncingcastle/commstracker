import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['47aef6b9b449485999e6df9711ba24f3'],
    table: 'sys_app_module',
    data: {
        active: true,
        application: '9f26a2fe5dcd472493e2947fc9afad2c',
        hint: 'Shortcut to the Commission Plans list for quick assignment updates',
        link_type: 'DIRECT',
        order: 34,
        override_menu_roles: false,
        query: 'x_823178_commissio_commission_plans_list.do?sysparm_query=is_active=true',
        require_confirmation: false,
        sys_domain: 'global',
        sys_domain_path: '/',
        title: 'Plan Assignment (Shortcut)',
        uncancelable: false,
    },
})
