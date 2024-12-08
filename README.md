# Devolutions Server Login Action

This GitHub Action authenticates with Devolutions Server and obtains an access token that can be used with other Devolutions Server actions.

## Prerequisites

Before using this action, you need:

1. A Devolutions Server application user (application ID and secret)
   - Follow [the application users management guide](https://docs.devolutions.net/hub/web-interface/administration/management/application-users/manage-application-users/) to create one
2. Appropriate permissions assigned to your application user through either:
   - [System Permissions](https://docs.devolutions.net/hub/web-interface/administration/configuration-security/system-permissions/)
   - Vault Permissions

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `server_url` | URL of the Devolutions Server | Yes | - |
| `app_key` | Application key for authentication | Yes | - |
| `app_secret` | Application secret for authentication | Yes | - |
| `output_variable` | Name of the environment variable to store the retrieved token | No | `DVLS_TOKEN` |

## Usage

```yaml
steps:
  - name: Login to Devolutions Server
    uses: devolutions-community/dvls-login@main
    with:
      server_url: 'https://your-server.devolutions.app'
      app_key: ${{ secrets.DVLS_APP_KEY }}
      app_secret: ${{ secrets.DVLS_APP_SECRET }}
      output_variable: 'MY_TOKEN' # Optional, defaults to DVLS_TOKEN
```

## Example Workflow

Here's a complete example showing how to use this action with the `dvls-get-secret-entry` action:

```yaml
name: Example Workflow
on: [push]

jobs:
  example:
    runs-on: ubuntu-latest
    steps:
      - name: Login to Devolutions Server
        uses: devolutions/dvls-login@v1
        with:
          server_url: 'https://your-server.devolutions.app'
          app_key: ${{ secrets.DVLS_APP_KEY }}
          app_secret: ${{ secrets.DVLS_APP_SECRET }}

      # Now you can use other Devolutions Server actions with the token
      - name: Get Secret
        uses: devolutions/dvls-get-secret-entry@v1
        with:
          server_url: 'https://your-server.devolutions.app'
          token: ${{ env.DVLS_TOKEN }}
          vault_name: 'MyVault'
          entry_name: 'MySecret'
```

## Security Notes

- Store your application key and secret as GitHub Secrets
- Never print the token or secrets in logs
- The token will be stored in an environment variable that is accessible to subsequent steps in your workflow
- Rotate your application credentials regularly
- Use the minimum required permissions for your application credentials

## Getting Application Credentials

For detailed instructions on setting up application credentials:

1. Follow the [Application Users Management Guide](https://docs.devolutions.net/hub/web-interface/administration/management/application-users/manage-application-users/) to create an application user
2. Configure permissions using either:
   - [System Permissions](https://docs.devolutions.net/hub/web-interface/administration/configuration-security/system-permissions/)
   - Vault-specific permissions

Make sure to:
- Save the generated application key and secret securely
- Store them as GitHub Secrets for use in your workflows
- Grant only the minimum required permissions for your use case

## License

This GitHub Action is available under the [MIT License](LICENSE). 
