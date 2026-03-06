import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['ad17b47d15cf407c8590b617165a8300'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_ad17b47d15cf407c8590b617165a8300.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
