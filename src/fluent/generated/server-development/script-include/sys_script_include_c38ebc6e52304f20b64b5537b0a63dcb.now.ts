import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['c38ebc6e52304f20b64b5537b0a63dcb'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_c38ebc6e52304f20b64b5537b0a63dcb.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
