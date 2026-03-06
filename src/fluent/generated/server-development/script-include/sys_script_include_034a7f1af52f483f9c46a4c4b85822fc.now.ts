import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['034a7f1af52f483f9c46a4c4b85822fc'],
    name: 'CommissionProgressHelper',
    script: Now.include('./sys_script_include_034a7f1af52f483f9c46a4c4b85822fc.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressHelper',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'package_private',
    active: true,
})
