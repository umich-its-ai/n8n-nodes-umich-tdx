/**
 * This file contains the operation definitions for the Ticket Search resource.
 */

import { INodeProperties } from 'n8n-workflow';
import { setBaseApiUrl } from '../helpers/authentication';

export const ticketSearchOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['ticketSearch'],
			},
		},
		options: [
			{
				name: 'Get Ticket by ID',
				value: 'getTicketById',
				action: 'Get a single TDX ticket',
				description: 'Get a single TDX ticket by ID',
				routing: {
					request: {
						method: 'GET',
					},
					send: {
						preSend: [
							setBaseApiUrl,
						],
					},
				},
			},
		],
		default: 'getTicketById',
	},
	{
		displayName: 'Ticket ID',
		description: 'The ID of the TDX ticket to get',
		required: true,
		name: 'ticketId',
		type: 'string',
		default: 0,
		routing: {
			request: {
				url: '={{$credentials.appId}}/tickets/{{$value}}', // $value is validated for safe URL path segments in the validateTicketIdInRequest helper
			},
		},
		displayOptions: {
			show: {
				resource: ['ticketSearch'],
			},
		},
		validateType: 'number',
	},
];
