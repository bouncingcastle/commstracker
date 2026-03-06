import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['8a32056da5ba4f03b38421a924491ab3'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_8a32056da5ba4f03b38421a924491ab3.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
