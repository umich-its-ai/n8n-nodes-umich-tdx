/**
 * This file contains the operation definitions for the Ticket Modification resource.
 */

import { INodeProperties } from 'n8n-workflow';
import { 
	setBaseApiUrl 
} from '../helpers/authentication';
import { preSendValidateCommentInRequest, preSendValidateUidInRequest } from '../helpers/validation';

export const ticketModificationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['ticketModification'],
			},
		},
		options: [
			{
				name: 'Add Comment to Ticket',
				value: 'addCommentToTicket',
				action: 'Add a comment to a TDX ticket',
				description: 'Add a comment to a TDX ticket',
				routing: {
					request: {
						method: 'POST',
					},
					send: {
						preSend: [
							setBaseApiUrl, 
							preSendValidateCommentInRequest, 
						],
					},
				},
			},
			{
				name: 'Add Ticket Contact',
				value: 'addTicketContact',
				action: 'Add a contact to a TDX ticket',
				description: 'Add a contact to a TDX ticket',
				routing: {
					request: {
						method: 'POST',
					},
					send: {
						preSend: [
							setBaseApiUrl, 
							preSendValidateUidInRequest, 
						],
					},
				},
			},
		],
		default: 'addCommentToTicket',
	},
	{
		displayName: 'New Comment',
		description: 'The new comment to add to the TDX ticket',
		required: true,
		name: 'comments',
		type: 'string',
		typeOptions: {
			rows: 5,
		},
		routing: {
			request: {
				url: '={{$credentials.appId}}/tickets/{{$parameter.ticketId}}/feed',
			},
			send: {
				type: 'body',
				property: 'comments',
			},
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['ticketModification'],
				operation: ['addCommentToTicket'],
			},
		},
	},
	{
		displayName: 'TDX User UID',
		description:
			'The internal TDX UID of the user to assign to the ticket',
		hint: 'User UID can be found in the JSON response to a user lookup by uniqname using the "User Lookup" resource in n8n.',
		name: 'contactUid',
		type: 'string',
		required: true,
		routing: {
			request: {
				url:
					'={{$credentials.appId}}/tickets/{{$parameter.ticketId}}/contacts/{{$value}}',
			},
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['ticketModification'],
				operation: ['addTicketContact'],
			},
		},
	},
	{
		displayName: 'Ticket ID',
		description: 'The ID of the TDX ticket to modify',
		required: true,
		name: 'ticketId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['ticketModification'],
				operation: ['addCommentToTicket', 'addTicketContact'],
			},
		},
		validateType: 'number',
	},
];
