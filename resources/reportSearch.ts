/**
 * This file contains the operation definitions for the Report By ID resource.
 */

import { INodeProperties } from "n8n-workflow"
import { setBaseApiUrl } from "../helpers/authentication"
import { preSendValidateSearchTextInRequest, preSendValidateOwnerUidInRequest } from "../helpers/validation"

export const reportSearchOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["reportSearch"]
			}
		},
		options: [
			{
				name: "Get Report by ID",
				value: "getReportById",
				action: "Get a single TDX report",
				description: "Get a single TDX report by ID",
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
				name: "Search Reports",
				value: "searchReports",
				action: "Search for TDX reports",
				description: "Search for TDX reports",
				routing: {
					request: {
						method: "POST"
					},
					send: {
						preSend: [
							setBaseApiUrl,
							preSendValidateSearchTextInRequest,
							preSendValidateOwnerUidInRequest
						]
					}
				}
			}
		],
		default: "getReportById"
	},
	{
		displayName: "Report ID",
		description: "The ID of the TDX report to get",
		required: true,
		name: "reportId",
		type: "string",
		default: "",
		hint: "The report's visibility settings must include the APIReportingAccess group for it to be searchable by this resource.",
		routing: {
			request: {
				url: "=reports/{{$value}}"
			}
		},
		displayOptions: {
			show: {
				resource: ["reportSearch"],
				operation: ["getReportById"]
			}
		},
		validateType: "number"
	},
	{
		displayName: "App ID",
		name: "forAppId",
		type: "hidden",
		default: "={{$credentials.appId}}", // Always use the app ID from the credentials
		routing: {
			request: {
				url: "=/reports/search"
			},
			send: {
				type: "body",
				property: "forAppId"
			}
		},
		displayOptions: {
			show: {
				resource: ["reportSearch"],
				operation: ["searchReports"]
			}
		}
	},
	{
		displayName: "Search Text",
		name: "searchText",
		type: "string",
		default: "",
		required: false,
		routing: {
			send: {
				type: "body",
				property: "searchText"
			}
		},
		displayOptions: {
			show: {
				resource: ["reportSearch"],
				operation: ["searchReports"]
			}
		}
	}
]
