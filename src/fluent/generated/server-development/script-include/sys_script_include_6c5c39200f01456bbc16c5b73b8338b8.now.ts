import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['6c5c39200f01456bbc16c5b73b8338b8'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_6c5c39200f01456bbc16c5b73b8338b8.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
