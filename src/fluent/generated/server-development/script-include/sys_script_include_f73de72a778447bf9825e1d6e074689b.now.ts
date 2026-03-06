import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['f73de72a778447bf9825e1d6e074689b'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_f73de72a778447bf9825e1d6e074689b.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
