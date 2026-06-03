import { INodeProperties } from "n8n-workflow"

export const additionalFields: INodeProperties[] = [
	/**
	 * Additional fields for the Create Ticket Operation
	 */
	{
		displayName: "Additional Parameters",
		name: "additionalParameters",
		type: "collection",
		default: {},
		placeholder: "Add Parameter",
		displayOptions: {
			show: {
				resource: ["ticketCreation"],
				operation: ["createTicket"]
			}
		},
		// https://solutions.teamdynamix.com/TDWebApi/Home/type/TeamDynamix.Api.Tickets.TicketCreateOptions
		options: [
			{
				displayName: "Apply Defaults",
				description:
					"Indicates whether or not to apply default values for properties that are not specified",
				name: "applyDefaults",
				type: "boolean",
				default: true,
				routing: {
					request: {
						qs: {
							ApplyDefaults: "={{ $value }}"
						}
					}
				}
			},
			{
				displayName: "Enable Notify Reviewer",
				name: "enableNotifyReviewer",
				description: "Whether reviewer notifications should be enabled.",
				type: "boolean",
				default: false,
				routing: {
					request: {
						// You've already set up the URL. qs appends the value of the field as a query string
						qs: {
							EnableNotifyReviewer: "={{ $value }}"
						}
					}
				}
			},
			{
				displayName: "Notify Requestor",
				name: "notifyRequestor",
				description:
					"Whether the requestor should be notified on ticket creation.",
				type: "boolean",
				default: false,
				routing: {
					request: {
						qs: {
							NotifyRequestor: "={{ $value }}"
						}
					}
				}
			},
			{
				displayName: "Notify Responsible",
				name: "notifyResponsible",
				description:
					"Whether the responsible resource(s) should be notified on ticket creation.",
				type: "boolean",
				default: false,
				routing: {
					request: {
						qs: {
							NotifyResponsible: "={{ $value }}"
						}
					}
				}
			},
			{
				displayName: "Allow Requestor Creation",
				name: "allowRequestorCreation",
				description:
					"Whether a requestor should be created if an existing person with matching information cannot be found.",
				type: "boolean",
				default: true,
				routing: {
					request: {
						qs: {
							AllowRequestorCreation: "={{ $value }}"
						}
					}
				}
			},
			{
				displayName: "Prefer Requestor Account and Priority",
				name: "preferRequestorAccountAndPriority",
				description:
					"Whether the account and priority associated with the ticket should be the requestors default account and priority, or from the supplied Account ID and Priority ID.",
				type: "boolean",
				default: false,
				routing: {
					request: {
						qs: {
							PreferRequestorAccountAndPriority: "={{ $value }}"
						}
					}
				}
			}
		]
	},
	{
		displayName: "Additional Parameters",
		name: "additionalParameters",
		type: "collection",
		default: {},
		placeholder: "Add Parameter",
		displayOptions: {
			show: {
				resource: ["ticketSearch"],
				operation: ["searchTickets"]
			}
		},
		options: [
			{
				displayName: "Ticket ID",
				name: "ticketId",
				type: "string",
				default: "",
				required: false,
				routing: {
					send: {
						type: "body",
						property: "ticketId"
					}
				},
				validateType: "number"
			},
			{
				displayName: "Parent Ticket ID",
				name: "parentTicketId",
				type: "string",
				default: "",
				required: false,
				routing: {
					send: {
						type: "body",
						property: "parentTicketId"
					}
				},
				validateType: "number"
			},
			{
				displayName: "Requestor Name Search",
				name: "requestorNameSearch",
				type: "string",
				description: "Search for requestors by name",
				default: "",
				required: false,
				routing: {
					send: {
						type: "body",
						property: "requestorNameSearch"
					}
				}
			},
			{
				displayName: "Requestor Email Search",
				name: "requestorEmailSearch",
				type: "string",
				description: "Search for requestors by email",
				default: "",
				required: false,
				routing: {
					send: {
						type: "body",
						property: "requestorEmailSearch"
					}
				}
			},
			{
				displayName: "Status IDs",
				name: "statusIds",
				type: "string",
				description: "Comma-separated list of status IDs to filter by",
				default: "",
				required: false,
				routing: {
					send: {
						type: "body",
						property: "statusIds" // The validation helper imported in ticketSearch.ts will turn the comma-separated list into an array and validate each ID
					}
				}
			},
			{
				displayName: "Service IDs",
				name: "serviceIds",
				type: "string",
				description: "Comma-separated list of service IDs to filter by",
				default: "",
				required: false,
				routing: {
					send: {
						type: "body",
						property: "serviceIds" // The validation helper imported in ticketSearch.ts will turn the comma-separated list into an array and validate each ID
					}
				}
			},
			{
				displayName: "Location IDs",
				name: "locationIds",
				type: "string",
				description: "Comma-separated list of location IDs to filter by",
				default: "",
				required: false,
				routing: {
					send: {
						type: "body",
						property: "locationIds" // The validation helper imported in ticketSearch.ts will turn the comma-separated list into an array and validate each ID
					}
				}
			},
			{
				displayName: "Account IDs",
				name: "accountIds",
				type: "string",
				description: "Comma-separated list of account IDs to filter by",
				default: "",
				required: false,
				routing: {
					send: {
						type: "body",
						property: "accountIds" // The validation helper imported in ticketSearch.ts will turn the comma-separated list into an array and validate each ID
					}
				}
			},
			{
				displayName: "Requestor UIDs",
				name: "requestorUids",
				type: "string",
				description: "Comma-separated list of requestor UIDs to filter by",
				default: "",
				required: false,
				routing: {
					send: {
						type: "body",
						property: "requestorUids" // The validation helper imported in ticketSearch.ts will turn the comma-separated list into an array and validate each ID
					}
				}
			},
			{
				displayName: "Responsibility UIDs",
				name: "responsibilityUids",
				type: "string",
				description: "Comma-separated list of responsibility UIDs to filter by",
				default: "",
				required: false,
				routing: {
					send: {
						type: "body",
						property: "responsibilityUids" // The validation helper imported in ticketSearch.ts will turn the comma-separated list into an array and validate each ID
					}
				}
			},
			{
				displayName: "Responsibility Group IDs",
				name: "responsibilityGroupIds",
				type: "string",
				description: "Comma-separated list of responsibility group IDs to filter by",
				default: "",
				required: false,
				routing: {
					send: {
						type: "body",
						property: "responsibilityGroupIds" // The validation helper imported in ticketSearch.ts will turn the comma-separated list into an array and validate each ID
					}
				}
			},
			{
				displayName: "Created Date From",
				name: "createdDateFrom",
				type: "dateTime",
				default: "",
				required: false,
				routing: {
					send: {
						type: "body",
						property: "createdDateFrom",
						value: "={{ new Date($value).toISOString().substring(0, 10) }}"
					}
				}
			},
			{
				displayName: "Created Date To",
				name: "createdDateTo",
				type: "dateTime",
				default: "",
				required: false,
				routing: {
					send: {
						type: "body",
						property: "createdDateTo",
						value: "={{ new Date($value).toISOString().substring(0, 10) }}"
					}
				}
			},
			{
				displayName: "Updated Date From",
				name: "updatedDateFrom",
				type: "dateTime",
				default: "",
				required: false,
				routing: {
					send: {
						type: "body",
						property: "updatedDateFrom",
						value: "={{ new Date($value).toISOString().substring(0, 10) }}"
					}
				}
			},
			{
				displayName: "Updated Date To",
				name: "updatedDateTo",
				type: "dateTime",
				default: "",
				required: false,
				routing: {
					send: {
						type: "body",
						property: "updatedDateTo",
						value: "={{ new Date($value).toISOString().substring(0, 10) }}"
					}
				}
			},
			{
				displayName: "Ticket Classification",
				name: "ticketClassification",
				type: "string",
				default: "",
				required: false,
				routing: {
					send: {
						type: "body",
						property: "ticketClassification"
					}
				}
			}
		]
	},
	{
		displayName: "Additional Parameters",
		name: "additionalParameters",
		type: "collection",
		default: {},
		placeholder: "Add Parameter",
		displayOptions: {
			show: {
				resource: ["reportSearch"],
				operation: ["searchReports"]
			}
		},
		options: [
			{
				displayName: "Owner UID",
				name: "ownerUid",
				type: "string",
				default: "",
				required: false,
				routing: {
					send: {
						type: "body",
						property: "ownerUid"
					}
				}
			},
			{
				displayName: "Report Source ID",
				name: "reportSourceId",
				type: "string",
				default: "",
				required: false,
				routing: {
					send: {
						type: "body",
						property: "reportSourceId"
					}
				},
				validateType: "number"
			}
		]
	}
]
