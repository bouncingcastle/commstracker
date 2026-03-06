import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['9f09466a03e748de8ea308fca04ed2f8'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_9f09466a03e748de8ea308fca04ed2f8.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
