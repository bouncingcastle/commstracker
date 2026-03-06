import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['6b8b5db2a6e144ada0d557a9a4451993'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_6b8b5db2a6e144ada0d557a9a4451993.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
