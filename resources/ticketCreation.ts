/**
 * This file contains the operation definitions for the Ticket Creation resource.
 */

import { INodeProperties } from "n8n-workflow"
import { setBaseApiUrl } from "../helpers/authentication"
import { preSendValidateRequestorEmailInRequest } from "../helpers/validation"

// TDX API: https://solutions.teamdynamix.com/TDWebApi/Home/type/TeamDynamix.Api.Tickets.Ticket

export const ticketCreationOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["ticketCreation"]
			}
		},
		options: [
			{
				name: "Create Ticket",
				value: "createTicket",
				action: "Create a new TDX ticket",
				description: "Create a new TDX ticket",
				routing: {
					request: {
						method: "POST"
					},
					send: {
						preSend: [setBaseApiUrl, preSendValidateRequestorEmailInRequest]
					}
				}
			}
		],
		default: "createTicket"
	},
	{
		displayName: "Title",
		description: "Ticket title",
		name: "title",
		type: "string",
		required: true,
		routing: {
			request: {
				url: "={{$credentials.appId}}/tickets/"
			},
			send: {
				type: "body",
				property: "Title"
			}
		},
		default: "",
		displayOptions: {
			show: {
				resource: ["ticketCreation"],
				operation: ["createTicket"]
			}
		}
	},
	{
		displayName: "Body",
		description: "The body of the ticket",
		name: "description",
		type: "string",
		typeOptions: {
			rows: 5
		},
		required: true,
		routing: {
			send: {
				type: "body",
				property: "Description"
			}
		},
		default: "",
		displayOptions: {
			show: {
				resource: ["ticketCreation"],
				operation: ["createTicket"]
			}
		}
	},
	{
		displayName: "Requestor",
		description: "Email address of the requestor",
		name: "requestorEmail",
		hint: "Must be a valid umich.edu email address",
		type: "string",
		required: true,
		routing: {
			send: {
				type: "body",
				property: "RequestorEmail"
			}
		},
		default: "",
		displayOptions: {
			show: {
				resource: ["ticketCreation"],
				operation: ["createTicket"]
			}
		}
	},
	{
		displayName: "Responsible Group ID",
		description: "Responsible group to create this ticket under.",
		hint: "Responsible Group ID can be found within TDX. In your TDX instance, on the create a new ticket form, locate the Responsible field, and perform a search for groups. Click View under profile. The ID to use is on the upper-left portion of the page named Group ID.",
		name: "responsibleGroupId",
		type: "string",
		required: false,
		routing: {
			send: {
				type: "body",
				property: "ResponsibleGroupID"
			}
		},
		default: "", // 944 = CoE-CAEN-Web-DeptApps
		displayOptions: {
			show: {
				resource: ["ticketCreation"],
				operation: ["createTicket"]
			}
		},
		validateType: "number"
	},
	{
		displayName: "Service ID",
		description: "Service that the ticket is related to.",
		hint: 'Service ID can be found in the JSON response to a ticket lookup using the "Ticket Search" resource in n8n.',
		name: "serviceId",
		type: "string",
		required: true,
		routing: {
			send: {
				type: "body",
				property: "ServiceID"
			}
		},
		default: "", // 31, // 1711 - CoE-CAEN Lecture Recording Service
		displayOptions: {
			show: {
				resource: ["ticketCreation"],
				operation: ["createTicket"]
			}
		},
		validateType: "number"
	},
	{
		displayName: "Type ID",
		description: "Sets the ticket type ID.",
		hint: 'If left blank, a default type ID will be used if one is set in the TDX instance and "Apply Defaults" is enabled under "Additional Parameters". Reach out to your TDX administrator to get the list of type IDs.',
		name: "typeId",
		type: "string",
		required: false,
		routing: {
			send: {
				type: "body",
				property: "TypeID"
			}
		},
		default: "",
		displayOptions: {
			show: {
				resource: ["ticketCreation"],
				operation: ["createTicket"]
			}
		},
		validateType: "number"
	},
	{
		displayName: "Source ID",
		description:
			"The source ID value of the ticket. Available values, 7 Chat, 9 Direct Input, 6 Email, 5 Phone, 8 Systems, 10 Walk-in, 4 Web",
		name: "sourceId",
		type: "hidden",
		required: true,
		routing: {
			send: {
				type: "body",
				property: "SourceID"
			}
		},
		default: 8,
		displayOptions: {
			show: {
				resource: ["ticketCreation"],
				operation: ["createTicket"]
			}
		},
		validateType: "number"
	},
	{
		displayName: "Status ID",
		description: "The status ID value of the ticket.",
		name: "statusId",
		type: "hidden",
		default: 0,
		required: true,
		routing: {
			send: {
				type: "body",
				property: "StatusID"
			}
		},
		displayOptions: {
			show: {
				resource: ["ticketCreation"],
				operation: ["createTicket"]
			}
		},
		validateType: "number"
	}
]
