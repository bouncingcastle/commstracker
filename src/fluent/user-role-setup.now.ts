import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Assign Commission Admin role to Abraham Lincoln (will be our system admin)
Record({
    $id: Now.ID['admin_role_assignment'],
    table: 'sys_user_has_role',
    data: {
        user: 'a8f98bb0eb32010045e1a5115206fe3a', // Abraham Lincoln
        role: '696ca2e6b66449e08519c5f20a55f2be', // x_823178_commissio.admin
        state: 'active'
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Assign Commission Rep role to Abel Tuter (sales rep)
Record({
    $id: Now.ID['rep1_role_assignment'],
    table: 'sys_user_has_role',
    data: {
        user: '62826bf03710200044e0bfc8bcbe5df1', // Abel Tuter
        role: '8a1e53939ebb45d7873f258a9ac7d757', // x_823178_commissio.rep
        state: 'active'
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Assign Commission Rep role to Adela Cervantsz (senior sales rep)
Record({
    $id: Now.ID['rep2_role_assignment'],
    table: 'sys_user_has_role',
    data: {
        user: '0a826bf03710200044e0bfc8bcbe5d7a', // Adela Cervantsz
        role: '8a1e53939ebb45d7873f258a9ac7d757', // x_823178_commissio.rep
        state: 'active'
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Assign Commission Finance role to Aileen Mottern (finance team)
Record({
    $id: Now.ID['finance_role_assignment'],
    table: 'sys_user_has_role',
    data: {
        user: '71826bf03710200044e0bfc8bcbe5d3b', // Aileen Mottern
        role: '5cc2731a0613479da7f42fd02edd07d9', // x_823178_commissio.finance
        state: 'active'
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Give Abraham Lincoln additional rep access to see both views
Record({
    $id: Now.ID['admin_rep_role_assignment'],
    table: 'sys_user_has_role',
    data: {
        user: 'a8f98bb0eb32010045e1a5115206fe3a', // Abraham Lincoln
        role: '8a1e53939ebb45d7873f258a9ac7d757', // x_823178_commissio.rep
        state: 'active'
    },
    $meta: {
        installMethod: 'demo'
    }
})