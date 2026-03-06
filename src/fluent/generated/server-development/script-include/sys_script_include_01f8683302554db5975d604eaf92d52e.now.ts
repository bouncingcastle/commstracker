import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['01f8683302554db5975d604eaf92d52e'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_01f8683302554db5975d604eaf92d52e.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
