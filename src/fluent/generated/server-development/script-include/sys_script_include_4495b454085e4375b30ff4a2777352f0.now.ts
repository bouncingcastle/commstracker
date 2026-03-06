import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['4495b454085e4375b30ff4a2777352f0'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_4495b454085e4375b30ff4a2777352f0.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
