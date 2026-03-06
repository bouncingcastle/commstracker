import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['6f6d84eb441d44318e50921f0a78ad49'],
    name: 'CommissionProgressHelper',
    script: Now.include('./sys_script_include_6f6d84eb441d44318e50921f0a78ad49.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressHelper',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
