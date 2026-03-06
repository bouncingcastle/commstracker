import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['3bc3c03c907447588c32afa9687ce086'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_3bc3c03c907447588c32afa9687ce086.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
