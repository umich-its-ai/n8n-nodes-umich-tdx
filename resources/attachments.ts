/**
 * This file contains the operation definitions for the Ticket By ID resource.
 */

import { INodeProperties } from "n8n-workflow"
import { setBaseApiUrl } from "../helpers/authentication"
import {
	prepareAttachmentDownloadRequest,
	transformAttachmentToBinary,
} from "../helpers/attachments"

export const attachmentsOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["attachments"]
			}
		},
		options: [
			{
				name: "Get Attachment Content by ID",
				value: "getAttachmentContentById",
				action: "Get a single TDX attachment",
				description: "Get the content of a TDX attachment by ID",
				routing: {
					request: {
						method: "GET",
					},
					send: {
						preSend: [setBaseApiUrl, prepareAttachmentDownloadRequest],
					},
					output: {
						postReceive: [transformAttachmentToBinary],
					},
				}
			}
		],
		default: "getAttachmentContentById"
	},
	{
		displayName: "Attachment ID",
		description: "The ID of the TDX attachment to get",
		required: true,
		name: "attachmentId",
		type: "string",
		default: 0,
		routing: {
			request: {
				url: "=attachments/{{$value}}/content" // $value is validated for safe URL path segments in the validateTicketIdInRequest helper
			}
		},
		displayOptions: {
			show: {
				resource: ["attachments"],
				operation: ["getAttachmentContentById"]
			}
		},
		validateType: "string"
	}
]
