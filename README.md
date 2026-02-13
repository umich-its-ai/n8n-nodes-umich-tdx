# umich-tdx-node

This is an n8n community node that provides integration with the University of Michigan (UMich) TeamDynamix (TDX) API. It enables you to interact with UMich TDX services directly from your n8n workflows, including ticket creation, modification, search, and user lookup operations.

The UMich TDX API is a service that allows programmatic access to TeamDynamix ticket management functionality for University of Michigan systems.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Table of Contents

[Installation](#installation)  
[Credentials](#credentials)  
[Resources and Operations](#resources-and-operations)  
[Validation and Security](#validation-and-security)  
[Test vs Production Environment](#test-vs-production-environment)  
[Usage Examples](#usage-examples)  
[Compatibility](#compatibility)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

In summary:
1. Install the package in your n8n instance
2. Restart n8n
3. The "UMich TDX" node will be available in the node palette

## Credentials

To use this node, you need to set up OAuth2 credentials with the U-M API Directory.

### Prerequisites

1. **U-M API Directory Account**: You need access to the [U-M API Directory](https://dir.api.it.umich.edu/) or alternatively the [U-M Test API Directory](https://dir-test.api.it.umich.edu).
2. **API Application**: Create an application in the U-M API Directory with the `tdxticket` scope
3. **API Key and Secret**: Obtain your API Key (Client ID) and API Secret (Client Secret) from your application

### Setting Up Credentials

1. In n8n, add a new credential of type "UMich TDX OAuth2 API"
2. Configure the following fields:
   - **Environment**: Choose either "Test" or "Production" (see [Test vs Production Environment](#test-vs-production-environment) below)
   - **App ID**: Your TeamDynamix App ID (numeric value)
   - **API Key**: The "Key" value from your app in the U-M API Directory
   - **API Secret**: The "Secret" value from your app in the U-M API Directory
3. Click "Connect my account" to authenticate
4. The credentials will automatically handle OAuth2 token management

### Credential Fields

| Field | Description | Required |
|-------|-------------|----------|
| Environment | Choose between Test or Production environment | Yes |
| App ID | Your TeamDynamix App ID (numeric) | Yes |
| API Key | Client ID from U-M API Directory | Yes |
| API Secret | Client Secret from U-M API Directory | Yes |

## Resources and Operations

The UMich TDX node supports four main resources, each with specific operations:

### 1. Ticket Search

Search and retrieve ticket information from TDX.

#### Operations

- **Get Ticket by ID**: Retrieve a single TDX ticket by its ID
  - **Parameters**:
    - `Ticket ID` (required): The numeric ID of the ticket to retrieve

### 2. Ticket Creation

Create new tickets in TDX.

#### Operations

- **Create Ticket**: Create a new TDX ticket
  - **Required Parameters**:
    - `Title`: The title of the ticket (max 500 characters)
    - `Body`: The description/body of the ticket (max 2000 characters)
    - `Requestor`: Email address of the requestor (must be a valid `@umich.edu` email)
    - `Service ID`: The service ID that the ticket is related to (numeric)
  - **Optional Parameters**:
    - `Responsible Group ID`: The responsible group ID to assign the ticket to (numeric)
  - **Additional Fields** (optional):
    - `Apply Defaults`: Whether to apply default values for unspecified properties (default: `true`)
    - `Enable Notify Reviewer`: Whether reviewer notifications should be enabled (default: `false`)
    - `Notify Requestor`: Whether the requestor should be notified on ticket creation (default: `false`)
    - `Notify Responsible`: Whether responsible resources should be notified (default: `false`)
    - `Allow Requestor Creation`: Whether to create a requestor if not found (default: `true`)
    - `Prefer Requestor Account and Priority`: Use requestor's default account/priority (default: `false`)
  - **Hidden Parameters** (automatically set):
    - `Source ID`: Set to `8` (Systems) by default
    - `Status ID`: Set to `0` by default

### 3. Ticket Modification

Modify existing tickets in TDX.

#### Operations

- **Add Comment to Ticket**: Add a comment to an existing TDX ticket
  - **Parameters**:
    - `Ticket ID` (required): The ID of the ticket to modify (numeric)
    - `New Comment` (required): The comment text to add (max 2000 characters)

- **Add Ticket Contact**: Add a contact (user) to a TDX ticket
  - **Parameters**:
    - `Ticket ID` (required): The ID of the ticket to modify (numeric)
    - `TDX User UID` (required): The internal TDX UID of the user to assign (alphanumeric)

### 4. User Lookup

Look up user information in TDX.

#### Operations

- **Find UID by Uniqname**: Find a user's internal TDX UID by their U-M Uniqname
  - **Parameters**:
    - `U-M Uniqname` (required): The uniqname to search for (3-8 lowercase letters only)

## Validation and Security

The node includes comprehensive validation measures to ensure data integrity and security:

### Input Validation

1. **Email Validation**:
   - Must be a valid email format
   - **Must be a `@umich.edu` email address** (enforced)
   - Used for: Requestor Email

2. **Uniqname Validation**:
   - Must be 3-8 characters long
   - Must contain only lowercase letters
   - Used for: User Lookup operations

3. **UID Validation**:
   - Must be alphanumeric (letters, numbers, dots, hyphens, underscores)
   - Prevents path traversal attacks
   - Used for: Contact UID, Ticket ID

4. **Numeric ID Validation**:
   - Must be numeric only
   - Used for: Service ID, Responsible Group ID, Status ID, Source ID, Ticket ID

5. **Text Length Validation**:
   - **Title**: Maximum 500 characters
   - **Description/Body**: Maximum 2000 characters
   - **Comments**: Maximum 2000 characters
   - Prevents DoS attacks from excessively large payloads

6. **Source ID Validation**:
   - Only allows specific source IDs
   - Currently only allows `8` (Systems)
   - Can be expanded in the future

### Security Features

- **Path Traversal Protection**: URL path segments are validated to prevent directory traversal attacks (`../`, query strings, etc.)
- **OAuth2 Authentication**: All requests use secure OAuth2 bearer token authentication
- **Input Sanitization**: All user inputs are validated before being sent to the API
- **Environment Isolation**: Test and production environments are completely separate

## Test vs Production Environment

The node supports both Test and Production environments. The environment is selected when configuring credentials.

### Test Environment

- **Base URL**: `https://gw-test.api.it.umich.edu/um/it`
- **Token URL**: `https://gw-test.api.it.umich.edu/um/oauth2/token`
- **Use Case**: Development, testing, and experimentation
- **Data**: Separate from production data

### Production Environment

- **Base URL**: `https://gw.api.it.umich.edu/um/it`
- **Token URL**: `https://gw.api.it.umich.edu/um/oauth2/token`
- **Use Case**: Live production workflows
- **Data**: Real production TDX data

### Switching Environments

To switch between environments:
1. Create separate credentials for Test and Production
2. Or update your existing credentials and change the "Environment" field
3. The node will automatically use the correct API endpoints based on your credential configuration

**Important**: Always test your workflows in the Test environment before using Production credentials.

## Usage Examples

### Example 1: Create a Ticket

1. Add a "UMich TDX" node to your workflow
2. Select Resource: "Ticket Creation"
3. Select Operation: "Create Ticket"
4. Fill in:
   - Title: "Example Ticket"
   - Body: "This is an example ticket created via n8n"
   - Requestor: "user@umich.edu"
   - Service ID: "31"
   - Responsible Group ID: "944" (optional)
5. Configure additional fields as needed
6. Execute the workflow

### Example 2: Look Up User and Add to Ticket

1. First node: "User Lookup" → "Find UID by Uniqname"
   - Enter uniqname: "jdoe"
2. Second node: "Ticket Modification" → "Add Ticket Contact"
   - Ticket ID: "12345"
   - TDX User UID: Use the UID from the first node's output

### Example 3: Get Ticket and Add Comment

1. First node: "Ticket Search" → "Get Ticket by ID"
   - Ticket ID: "12345"
2. Second node: "Ticket Modification" → "Add Comment to Ticket"
   - Ticket ID: "12345"
   - New Comment: "Status update from automated workflow"

## Compatibility

- **Minimum n8n version**: Compatible with n8n workflow API version 1
- **Node.js**: Compatible with Node.js versions supported by n8n
- **TypeScript**: Built with TypeScript 5.9.2

## Resources

### Documentation

- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/#community-nodes)
- [U-M API Directory - TDX Ticket API Documentation](https://dir.api.it.umich.edu/docs/tdxticket/1/overview)
- [TeamDynamix API Documentation](https://solutions.teamdynamix.com/TDWebApi/Home/type/TeamDynamix.Api.Tickets.Ticket)
- [U-M API Directory](https://dir.api.it.umich.edu/)

### Finding IDs

- **Service ID**: Found in the JSON response when retrieving a ticket via "Ticket Search"
- **Responsible Group ID**: In TDX, go to the create ticket form, search for groups in the Responsible field, click "View" under the profile, and find the "Group ID" in the upper-left portion of the page
- **TDX User UID**: Found in the JSON response when using "User Lookup" → "Find UID by Uniqname"

### Support

For issues, questions, or contributions, please refer to the repository:
- **Repository**: [n8n-umich-tdx](https://github.com/cpuzzuol/n8n-umich-tdx)
- **Author**: Chris Puzzuoli (cpuzzuol@umich.edu)

---

**Note**: This node is designed specifically for University of Michigan TeamDynamix integration. All email addresses must be `@umich.edu` addresses, and you must have appropriate access to the U-M API Directory to use this node.
