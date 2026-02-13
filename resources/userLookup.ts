/**
 * This file contains the operation definitions for the User Lookup resource.
 */

import { INodeProperties } from 'n8n-workflow';
import { 
	setBaseApiUrl } from '../helpers/authentication';
import { preSendValidateUniqnameInRequest } from '../helpers/validation';

export const userLookupOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['userLookup'],
			},
		},
		options: [
			{
				name: 'Find UID by Uniqname',
				value: 'findUidByUniqname',
				action: 'Find TDX UID by Uniqname',
				description: 'Find a user\'s internal TDX UID by their U-M Uniqname',
				routing: {
					request: {
						method: 'GET',
						url: '=people/search',
					},
					send: {
						preSend: [
							setBaseApiUrl, 
							preSendValidateUniqnameInRequest, 
						],
					},
				},
			},
		],
		default: 'findUidByUniqname',
	},
	{
		displayName: 'U-M Uniqname',
		description: '',
		name: 'uniqname',
		type: 'string',
		required: true,
		routing: {
			request: {
				qs: {
					UserName: '={{ $value }}@umich.edu',
				},
			},
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['userLookup'],
				operation: ['findUidByUniqname'],
			},
		},
	},
];
