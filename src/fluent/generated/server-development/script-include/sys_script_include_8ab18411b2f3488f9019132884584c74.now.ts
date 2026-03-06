import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['8ab18411b2f3488f9019132884584c74'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_8ab18411b2f3488f9019132884584c74.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
