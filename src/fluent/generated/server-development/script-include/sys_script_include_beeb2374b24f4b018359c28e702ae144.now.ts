import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['beeb2374b24f4b018359c28e702ae144'],
    name: 'CommissionProgressHelper',
    script: Now.include('./sys_script_include_beeb2374b24f4b018359c28e702ae144.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressHelper',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'package_private',
    active: true,
})
