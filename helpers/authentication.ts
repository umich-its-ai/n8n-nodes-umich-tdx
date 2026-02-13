// TeamDynamix API Documentation for working with U-M API: https://docs.google.com/document/d/14G-E5Zb2208cHcE5genW5mW0bVEEEtfCTH1N6erP0gA/edit?tab=t.0

import { 
	IExecuteSingleFunctions, 
	IHttpRequestOptions, 
	// LoggerProxy as Logger 
} from 'n8n-workflow';

/**
 * Get the base URL for the U-M API based on environment.
 * @param environment 
 * @returns 
 */
export function getBaseUrl(environment: string = 'production'): string {
	return environment === 'test'
		? 'https://gw-test.api.it.umich.edu/um'
		: 'https://gw.api.it.umich.edu/um';
}

/**
 * Append '/it' to the base URL based on environment. Use this in the preSend hook to set the base URL for each request.
 * @param this - The context object
 * @param requestOptions - The request options object
 * @returns 
 */
export async function setBaseApiUrl(this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions> {
	const credentials = await this.getCredentials('umichTdxOAuth2Api');
	const environment = credentials.environment as string;
	const baseUrl = getBaseUrl(environment);
	requestOptions.baseURL = `${baseUrl}/it`;
	return requestOptions;
}
