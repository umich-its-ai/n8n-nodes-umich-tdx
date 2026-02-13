import { INodeProperties } from 'n8n-workflow';

export const additionalFields: INodeProperties[] = [
	/**
	 * Additional fields for the Create Ticket Operation
	 */
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		default: {},
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['ticketCreation'],
				operation: ['createTicket'],
			},
		},
		// https://solutions.teamdynamix.com/TDWebApi/Home/type/TeamDynamix.Api.Tickets.TicketCreateOptions
		options: [
			{
				displayName: 'Apply Defaults',
				description: 'Indicates whether or not to apply default values for properties that are not specified',
				name: 'applyDefaults',
				type: 'boolean',
				default: true,
				routing: {
					request: {
						qs: {
							ApplyDefaults: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Enable Notify Reviewer',
				name: 'enableNotifyReviewer',
				description: 'Whether reviewer notifications should be enabled.',
				type: 'boolean',
				default: false,
				routing: {
					request: {
						// You've already set up the URL. qs appends the value of the field as a query string
						qs: {
							EnableNotifyReviewer: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Notify Requestor',
				name: 'notifyRequestor',
				description: 'Whether the requestor should be notified on ticket creation.',
				type: 'boolean',
				default: false,
				routing: {
					request: {
						qs: {
							NotifyRequestor: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Notify Responsible',
				name: 'notifyResponsible',
				description: 'Whether the responsible resource(s) should be notified on ticket creation.',
				type: 'boolean',
				default: false,
				routing: {
					request: {
						qs: {
							NotifyResponsible: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Allow Requestor Creation',
				name: 'allowRequestorCreation',
				description: 'Whether a requestor should be created if an existing person with matching information cannot be found.',
				type: 'boolean',
				default: true,
				routing: {
					request: {
						qs: {
							AllowRequestorCreation: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Prefer Requestor Account and Priority',
				name: 'preferRequestorAccountAndPriority',
				description: 'Whether the account and priority associated with the ticket should be the requestors default account and priority, or from the supplied Account ID and Priority ID.',
				type: 'boolean',
				default: false,
				routing: {
					request: {
						qs: {
							PreferRequestorAccountAndPriority: '={{ $value }}',
						},
					},
				},
			},
		],
	},
	// {
	// 	displayName: 'Additional Fields',
	// 	name: 'additionalFields',
	// 	type: 'collection',
	// 	default: {},
	// 	placeholder: 'Add Field',
	// 	displayOptions: {
	// 		show: {
	// 			resource: ['ticketSearch', 'ticketModification'],
	// 			operation: [
	// 				'getTicketById',
	// 				'getTicketCommentsById',
	// 				'modifyTicket',
	// 				'assignUserToTicket',
	// 			],
	// 		},
	// 	},
	// 	options: [
	// 		{
	// 			displayName: 'Date for Whatever',
	// 			name: 'dateForWhatever',
	// 			type: 'dateTime',
	// 			default: '',
	// 			routing: {
	// 				request: {
	// 					// You've already set up the URL. qs appends the value of the field as a query string
	// 					qs: {
	// 						date: '={{ new Date($value).toISOString().substr(0,10) }}',
	// 					},
	// 				},
	// 			},
	// 		},
	// 	],
	// },
];
