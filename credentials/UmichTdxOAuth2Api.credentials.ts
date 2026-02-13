import { ICredentialType, Icon, INodeProperties, ICredentialTestRequest } from 'n8n-workflow';

export class UmichTdxOAuth2Api implements ICredentialType {
	name = 'umichTdxOAuth2Api';

	displayName = 'UMich TDX OAuth2 API';

	icon: Icon = 'file:umichtdx.svg';

	documentationUrl =
		'https://dir.api.it.umich.edu/docs/tdxticket/1/overview';

	extends = ['oAuth2Api'];

	properties: INodeProperties[] = [
        {
            displayName: 'Environment',
            name: 'environment',
            type: 'options',
            options: [
                { name: 'Production', value: 'production' },
                { name: 'Test', value: 'test' },
            ],
            default: 'production',
        },
        {
            displayName: 'App ID',
            name: 'appId',
            type: 'number',
			typeOptions: {
				minValue: 1,
				numberPrecision: 0,
			},
            default: '',
            required: true,
        },
		{
			displayName: 'Allowed HTTP Request Domains',
			name: 'allowedHttpRequestDomains',
			type: 'hidden',
			default: 'domains',
		},
		{
			displayName: 'Allowed Domains',
			name: 'allowedDomains',
			type: 'hidden',
			default: 'gw-test.api.it.umich.edu, gw.api.it.umich.edu',
		},

		/*
		 * OAuth2 base fields
		 */
		// Add hint
		{
			displayName: 'API Key',
			name: 'clientId',
			hint: 'Use the "Key" value from your app in the U-M API Directory',
			type: 'string',
			displayOptions: {
				show: {
					useDynamicClientRegistration: [false],
				},
			},
			default: '',
			required: true,
		},
		// Add hint
		{
			displayName: 'API Secret',
			name: 'clientSecret',
			hint: 'Use the "Secret" value from your app in the U-M API Directory',
			type: 'string',
			displayOptions: {
				show: {
					useDynamicClientRegistration: [false],
				},
			},
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
		},
		{
			displayName: 'Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: '={{$self.environment === "test" ? "https://gw-test.api.it.umich.edu/um/oauth2/token" : "https://gw.api.it.umich.edu/um/oauth2/token"}}',
		},
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'clientCredentials',
		},
        {
            displayName: 'Authentication',
            name: 'authentication',
            type: 'hidden',
            default: 'header',
        },

		/*
		 * UMich / TDX specifics
		 */
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			required: true,
			default: 'tdxticket',
			description: 'OAuth scope',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'hidden',
			required: true,
			default: '={{$self.environment === "test" ? "https://gw-test.api.it.umich.edu/um/it" : "https://gw.api.it.umich.edu/um/it"}}',
		},
	];

	/**
	 * Credential test
	 *
	 * Uses a harmless GET that:
	 * - Requires OAuth bearer token
	 * - Does not mutate data
	 *
	 * If this succeeds, the credential is valid.
	 */
	test: ICredentialTestRequest = {
		request: {
		    baseURL: '={{$credentials.baseUrl}}',
			url: '={{"/" + $credentials.appId + "/ticketsearch"}}',
			method: 'POST',
			body: {
				MaxResults: 1
			}
		},
	};
}
