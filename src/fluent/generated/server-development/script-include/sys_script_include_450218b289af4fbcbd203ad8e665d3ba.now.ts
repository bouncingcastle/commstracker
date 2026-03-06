import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['450218b289af4fbcbd203ad8e665d3ba'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_450218b289af4fbcbd203ad8e665d3ba.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
