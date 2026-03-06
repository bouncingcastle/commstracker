import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['6ea2615d3a984c7d8400b749908bf1cc'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_6ea2615d3a984c7d8400b749908bf1cc.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
