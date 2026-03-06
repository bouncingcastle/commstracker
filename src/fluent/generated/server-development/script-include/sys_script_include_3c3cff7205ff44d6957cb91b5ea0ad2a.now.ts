import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['3c3cff7205ff44d6957cb91b5ea0ad2a'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_3c3cff7205ff44d6957cb91b5ea0ad2a.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
