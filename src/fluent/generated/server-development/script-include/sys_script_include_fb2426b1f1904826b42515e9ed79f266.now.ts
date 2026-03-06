import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['fb2426b1f1904826b42515e9ed79f266'],
    name: 'CommissionProgressHelper',
    script: Now.include('./sys_script_include_fb2426b1f1904826b42515e9ed79f266.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressHelper',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'package_private',
    active: true,
})
