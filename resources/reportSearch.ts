/**
 * This file contains the operation definitions for the Report By ID resource.
 */

import { INodeProperties } from 'n8n-workflow';
import { setBaseApiUrl } from '../helpers/authentication';

export const reportSearchOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['reportSearch'],
			},
		},
		options: [
			{
				name: 'Get Report by ID',
				value: 'getReportById',
				action: 'Get a single TDX report',
				description: 'Get a single TDX report by ID',
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
		default: 'getReportById',
	},
	{
		displayName: 'Report ID',
		description: 'The ID of the TDX report to get',
		required: true,
		name: 'reportId',
		type: 'string',
		default: '',
		hint: 'The report\'s visibility settings must include the APIReportingAccess group for it to be searchable by this resource.',
		routing: {
			request: {
				url: '=reports/{{$value}}',
			},
		},
		displayOptions: {
			show: {
				resource: ['reportSearch'],
			},
		},
		validateType: 'number',
	},
];
