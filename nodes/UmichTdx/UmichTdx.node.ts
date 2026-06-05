import { INodeType, INodeTypeDescription, NodeConnectionTypes } from 'n8n-workflow';
import { allResources } from '../../resources';
import { allFields } from '../../fields';

export class UmichTdx implements INodeType {
	description: INodeTypeDescription = {
		displayName: "UMich TDX",
		name: "umichTdx",
		icon: "file:umichtdx.svg",
		group: ["transform"],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: "Connect to UMich TDX",
		defaults: {
			name: "UMich TDX"
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: "umichTdxOAuth2Api",
				required: true
			}
		],
		requestDefaults: {
			// baseURL set dynamically in the authentication helper based on the environment
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			}
		},
		usableAsTool: true,
		properties: [...allResources, ...allFields]
	}

	methods = {
		loadOptions: {
			// Get a list of responsible group IDs from the U-M API... U-M API DOES NOT EXPOSE THIS ENDPOINT as of 1/19/26
			// async getResponsibleGroupIDs(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
			// 	await this.getCredentials('umichTdxOAuth2Api');
			// 	return [] as INodePropertyOptions[];
			// }
		}
	}
}
