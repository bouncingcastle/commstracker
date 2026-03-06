import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['5d625805ae1f460eb2572ad775c82ee5'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_5d625805ae1f460eb2572ad775c82ee5.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
