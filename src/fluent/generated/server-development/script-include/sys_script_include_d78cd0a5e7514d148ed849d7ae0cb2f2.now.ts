import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['d78cd0a5e7514d148ed849d7ae0cb2f2'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_d78cd0a5e7514d148ed849d7ae0cb2f2.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
