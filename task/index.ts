import tl = require('azure-pipelines-task-lib/task');

async function run() {
    try
    {
        const endpointUrl: string | undefined = tl.getInput('endpointUrl', true);
        const allowInsecureInput: string | undefined = tl.getInput('allowInsecure', true);
        const allowInsecure = (allowInsecureInput === 'true');
        const requestHeaders: string | undefined = tl.getInput('requestHeaders', false);

        if (allowInsecure)
        {
            process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
        }
        else if (!allowInsecure)
        {
            process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "1";
        }

        // Create header dict from input json
        let headers = null;
        if (typeof requestHeaders != 'undefined' && requestHeaders)
        {
            headers = JSON.parse(requestHeaders)
        }

        const fetch = require("node-fetch");
        const response = await fetch(endpointUrl, {
            method: 'GET',
            headers: headers
        })
        
        console.log("Statuscode:", response.status)
        console.log(await response.text())

        // Check if the return statuscode is in the 200 range
        if (response.status >= 300 || response.status < 200)
        {
            console.error('Statuscode not in 200 range -->', response.status);
            tl.setResult(tl.TaskResult.Failed, 'Error: statuscode not in 200 range --> ' + response.status);
        }

        // Check if the response returned ok and throw the error/reason if not
        // This check is needed to show any errors such as untrusted certificates in the log
        if (!response.ok)
        {
            tl.setResult(tl.TaskResult.Failed, response.error);
        }

    }
    catch (err)
    {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();
