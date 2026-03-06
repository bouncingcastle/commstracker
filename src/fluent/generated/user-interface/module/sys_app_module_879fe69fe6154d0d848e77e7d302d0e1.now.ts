import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['879fe69fe6154d0d848e77e7d302d0e1'],
    table: 'sys_app_module',
    data: {
        active: true,
        hint: 'Assign and manage representative commission plans',
        link_type: 'DIRECT',
        order: 34,
        override_menu_roles: false,
        query: 'x_823178_commissio_commission_plans_list.do?sysparm_query=is_active=true',
        require_confirmation: false,
        sys_domain: 'global',
        sys_domain_path: '/',
        title: 'Plan & Compensation',
        uncancelable: false,
    },
})
