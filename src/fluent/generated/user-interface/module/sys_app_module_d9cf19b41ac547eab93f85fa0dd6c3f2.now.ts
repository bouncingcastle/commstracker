import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['d9cf19b41ac547eab93f85fa0dd6c3f2'],
    table: 'sys_app_module',
    data: {
        active: true,
        hint: 'Track your earnings, pending amounts, and deal pipeline',
        link_type: 'DIRECT',
        order: 7,
        override_menu_roles: false,
        query: 'x_823178_commissio_progress.do',
        require_confirmation: false,
        sys_domain: 'global',
        sys_domain_path: '/',
        title: 'My Progress',
        uncancelable: false,
    },
})
