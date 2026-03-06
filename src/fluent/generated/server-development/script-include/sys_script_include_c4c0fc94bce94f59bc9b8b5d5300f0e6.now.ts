import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['c4c0fc94bce94f59bc9b8b5d5300f0e6'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_c4c0fc94bce94f59bc9b8b5d5300f0e6.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
