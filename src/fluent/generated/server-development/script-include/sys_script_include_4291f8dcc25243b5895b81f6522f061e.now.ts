import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['4291f8dcc25243b5895b81f6522f061e'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_4291f8dcc25243b5895b81f6522f061e.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
