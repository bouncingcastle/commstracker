import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['4e1bcb5c2c5b48c0989bd81c4d438bd9'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_4e1bcb5c2c5b48c0989bd81c4d438bd9.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
