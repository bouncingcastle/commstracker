import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['591c4ce6d7c246df9eff0b962d705194'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_591c4ce6d7c246df9eff0b962d705194.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
