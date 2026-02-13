/**
 * This file exports all the resources and operations for the Umich Tdx node. It is cleaner than having to import each file individually.
 */

// Re-export individual exports for flexibility
export * from './ticketSearch';
export * from './ticketCreation';
export * from './ticketModification';
export * from './userLookup';
export * from './resource';

// Aggregated export for convenience - combines all resources and operations
import { ticketResource } from './resource';
import { ticketSearchOperations } from './ticketSearch';
import { ticketCreationOperations } from './ticketCreation';
import { ticketModificationOperations } from './ticketModification';
import { userLookupOperations } from './userLookup';
import { INodeProperties } from 'n8n-workflow';

export const allResources: INodeProperties[] = [
	ticketResource,
	...ticketSearchOperations,
	...ticketCreationOperations,
	...ticketModificationOperations,
	...userLookupOperations,
];
