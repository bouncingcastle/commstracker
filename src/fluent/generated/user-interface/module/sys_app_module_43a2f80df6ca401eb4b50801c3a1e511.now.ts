import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['43a2f80df6ca401eb4b50801c3a1e511'],
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
