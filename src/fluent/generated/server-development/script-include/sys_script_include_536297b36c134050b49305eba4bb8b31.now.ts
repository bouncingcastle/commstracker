import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['536297b36c134050b49305eba4bb8b31'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_536297b36c134050b49305eba4bb8b31.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
