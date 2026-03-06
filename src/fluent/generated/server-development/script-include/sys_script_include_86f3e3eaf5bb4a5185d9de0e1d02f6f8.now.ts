import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['86f3e3eaf5bb4a5185d9de0e1d02f6f8'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_86f3e3eaf5bb4a5185d9de0e1d02f6f8.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
