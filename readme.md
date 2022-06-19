# Call REST Endpoint
This extension will execute a REST call against an endpoint and retry for a given amount of seconds until a 200 statuscode is returned.
## Build and deploy
The azure-pipelines.yml definition builds and versions the extension before uploading it to the Azure DevOps marketplace where it can be installed to an organization.
## Example
To use the task in an Azure pipeline follow this example.
``` yaml
stages:
- stage: test
  jobs:
  - deployment: deployment
    environment: 
      name: test
      resourceType: VirtualMachine
    strategy:
        rolling:
          maxParallel: 1
          deploy:
            steps:
            - task: call-rest-endpoint@0
              displayName: Verify Deployment
              inputs:
                endpointUrl: https://api.callofthevoid.dk
                method: GET
                allowInsecure: false
                requestHeaders: '{"content-type": "application/json"}'
                timeout: 60
```
