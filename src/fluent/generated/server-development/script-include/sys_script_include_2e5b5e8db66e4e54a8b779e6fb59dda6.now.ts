import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['2e5b5e8db66e4e54a8b779e6fb59dda6'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_2e5b5e8db66e4e54a8b779e6fb59dda6.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
