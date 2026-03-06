import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['41d36e4905a64b2e81f75624607cc650'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_41d36e4905a64b2e81f75624607cc650.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
