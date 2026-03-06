import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['678597ec24b547b8bd75ab5e6962e58e'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_678597ec24b547b8bd75ab5e6962e58e.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
