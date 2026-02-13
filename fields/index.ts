/**
 * This file exports all the fields for the Umich Tdx node. It is cleaner than having to import each file individually.
 */

// Re-export individual exports for flexibility
export * from './commonFields';
export * from './additionalFields';

// Aggregated export for convenience - combines all fields
import { commonFields } from './commonFields';
import { additionalFields } from './additionalFields';
import { INodeProperties } from 'n8n-workflow';

export const allFields: INodeProperties[] = [...commonFields, ...additionalFields];
