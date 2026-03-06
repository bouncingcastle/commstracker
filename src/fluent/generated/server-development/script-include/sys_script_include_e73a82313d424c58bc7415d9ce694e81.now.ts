import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['e73a82313d424c58bc7415d9ce694e81'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_e73a82313d424c58bc7415d9ce694e81.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
