import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['5aaa9d3213d34ec2af07977a85fc66c3'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_5aaa9d3213d34ec2af07977a85fc66c3.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
