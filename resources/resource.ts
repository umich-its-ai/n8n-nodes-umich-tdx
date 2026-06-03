/**
 * This file contains the top-level definition for the Ticket resource.
 */

import { INodeProperties } from "n8n-workflow";

export const ticketResource: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	options: [
		{
			name: 'Ticket Search',
			value: 'ticketSearch',
		},
		{
			name: 'Ticket Creation',
			value: 'ticketCreation',
		},
		{
			name: 'Ticket Modification',
			value: 'ticketModification',
		},
		{
			name: 'User Lookup',
			value: 'userLookup',
		},
		{
			name: 'Report Search',
			value: 'reportSearch',
		},
	],
	default: 'ticketSearch',
};
