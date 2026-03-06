import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['723d39e86d0244d6863b87062fc51464'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_723d39e86d0244d6863b87062fc51464.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
