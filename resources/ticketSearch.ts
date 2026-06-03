/**
 * This file contains the operation definitions for the Ticket By ID resource.
 */

import { INodeProperties } from "n8n-workflow"
import { setBaseApiUrl } from "../helpers/authentication"
import { preSendValidateSearchTextInRequest, 
	preSendValidateStatusIdsInRequest, 
	preSendValidateServiceIdsInRequest,
	preSendValidateLocationIdsInRequest,
	preSendValidateAccountIdsInRequest,
	preSendValidateRequestorUidsInRequest,
	preSendValidateResponsibilityUidsInRequest,
	preSendValidateResponsibilityGroupIdsInRequest,
	preSendValidateRequestorNameSearchInRequest,
	preSendValidateRequestorEmailSearchInRequest,
	preSendValidateTicketClassificationInRequest
} from "../helpers/validation"

export const ticketSearchOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["ticketSearch"]
			}
		},
		options: [
			{
				name: "Get Ticket by ID",
				value: "getTicketById",
				action: "Get a single TDX ticket",
				description: "Get a single TDX ticket by ID",
				routing: {
					request: {
						method: "GET"
					},
					send: {
						preSend: [setBaseApiUrl]
					}
				}
			},
			{
				name: "Search Tickets",
				value: "searchTickets",
				action: "Search for TDX tickets",
				description: "Search for TDX tickets",
				routing: {
					request: {
						method: "POST"
					},
					send: {
						preSend: [
							setBaseApiUrl,
							preSendValidateSearchTextInRequest,
							preSendValidateStatusIdsInRequest,
							preSendValidateServiceIdsInRequest,
							preSendValidateLocationIdsInRequest,
							preSendValidateAccountIdsInRequest,
							preSendValidateRequestorUidsInRequest,
							preSendValidateResponsibilityUidsInRequest,
							preSendValidateResponsibilityGroupIdsInRequest,
							preSendValidateRequestorNameSearchInRequest,
							preSendValidateRequestorEmailSearchInRequest,
							preSendValidateTicketClassificationInRequest
						]
					}
				}
			}
		],
		default: "getTicketById"
	},
	{
		displayName: "Ticket ID",
		description: "The ID of the TDX ticket to get",
		required: true,
		name: "ticketId",
		type: "string",
		default: 0,
		routing: {
			request: {
				url: "={{$credentials.appId}}/tickets/{{$value}}" // $value is validated for safe URL path segments in the validateTicketIdInRequest helper
			}
		},
		displayOptions: {
			show: {
				resource: ["ticketSearch"],
				operation: ["getTicketById"]
			}
		},
		validateType: "number"
	},
	{
		displayName: "Search Text",
		name: "searchText",
		type: "string",
		default: "",
		routing: {
			request: {
				url: "={{$credentials.appId}}/ticketsearch"
			},
			send: {
				type: "body",
				property: "searchText"
			}
		},
		displayOptions: {
			show: {
				resource: ["ticketSearch"],
				operation: ["searchTickets"]
			}
		}
	},
	{
		displayName: "Max Results",
		description: "The maximum number of results to return",
		name: "maxResults",
		type: "string",
		default: "3",
		routing: {
			send: {
				type: "body",
				property: "maxResults"
			}
		},
		displayOptions: {
			show: {
				resource: ["ticketSearch"],
				operation: ["searchTickets"]
			}
		},
		validateType: "number"
	}
]
