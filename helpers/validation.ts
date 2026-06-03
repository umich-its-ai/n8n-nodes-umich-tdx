/**
 * Validation helpers for TDX API requests
 * These are used to validate the values of the parameters in the request options before the request is sent
 * CP 1/19/26
 */

import { IExecuteSingleFunctions, IHttpRequestOptions } from "n8n-workflow"

/**
 * Validates that a value contains only safe characters for URL path segments
 * Allows alphanumeric characters, hyphens, and underscores only
 * @param value - The value to validate
 * @param fieldName - The name of the field to validate
 * @throws Error if the value is not a non-empty string or contains invalid characters
 */
export function validatePathSegment(value: string, fieldName: string): void {
	if (!value || typeof value !== "string") {
		throw new Error(`${fieldName} must be a non-empty string`)
	}

	// This prevents path traversal attacks (../), query strings (?param=), etc.
	if (!/^[a-zA-Z0-9._-]+$/.test(value)) {
		throw new Error(
			`${fieldName} contains invalid characters. Only alphanumeric characters, hyphens, underscores, and dots are allowed.`
		)
	}
}

/**
 * Validates UID is alphanumeric
 * @param uid - The UID to validate
 * @throws Error if the UID is not alphanumeric
 */
export function validateUid(uid: string): void {
	validatePathSegment(uid, "UID")
}

/**
 * Validates Uniqname is lowercase letters only, between 3-8 characters
 * @param uniqname - The Uniqname to validate
 * @throws Error if the Uniqname is not lowercase letters only
 */
export function validateUniqname(uniqname: string): void {
	validatePathSegment(uniqname, "U-M Uniqname")

	if (!/^[a-z]+$/.test(uniqname)) {
		throw new Error("U-M Uniqname must be lowercase letters only")
	}

	if (uniqname.length < 3 || uniqname.length > 8) {
		throw new Error("U-M Uniqname must be between 3-8 characters")
	}
}

/**
 * Validates email format
 * @param email - The email to validate
 * @param fieldName - The name of the field to validate
 * @throws Error if the email is not a valid email address
 */
export function validateEmail(
	email: string,
	fieldName: string = "Email"
): void {
	if (!email || typeof email !== "string") {
		throw new Error(`${fieldName} must be a non-empty string`)
	}

	// Email validation regex - must be @umich.edu
	const emailRegex = /^[^\s@]+@umich\.edu$/
	if (!emailRegex.test(email)) {
		throw new Error(`${fieldName} must be a valid umich.edu email address`)
	}
}

/**
 * Validates numeric ID (for serviceId, etc.)
 * @param id - The ID to validate
 * @param fieldName - The name of the field to validate
 * @throws Error if the ID is not numeric
 */
export function validateNumericId(id: string, fieldName: string): void {
	validatePathSegment(id, fieldName)

	if (!/^\d+$/.test(id)) {
		throw new Error(`${fieldName} must be numeric`)
	}
}

/**
 * Validates source ID is in allowed range (8 = System... only allow that one for now but could be expanded)
 * @param sourceId - The source ID to validate
 * @throws Error if the source ID is not in the allowed range
 */
export function validateSourceId(sourceId: string): void {
	validateNumericId(sourceId, "Source ID")

	const allowedSourceIds = ["8"]
	if (!allowedSourceIds.includes(sourceId)) {
		throw new Error(`Source ID must be one of: ${allowedSourceIds.join(", ")}`)
	}
}

/**
 * Validates text field length to prevent DoS
 * @param value - The value to validate
 * @param fieldName - The name of the field to validate
 * @param maxLength - The maximum length of the value
 * @throws Error if the value exceeds the maximum length
 */
export function validateTextLength(
	value: string,
	fieldName: string,
	maxLength: number = 2000
): void {
	if (value && value.length > maxLength) {
		throw new Error(
			`${fieldName} exceeds maximum length of ${maxLength} characters`
		)
	}
}

/**
 * PreSend hook to validate UID in request
 * @param this - The context object
 * @param requestOptions - The request options object
 * @returns The request options object
 */
export async function preSendValidateUidInRequest(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions
): Promise<IHttpRequestOptions> {
	const contactUid = this.getNodeParameter("contactUid") as string
	if (contactUid) {
		validateUid(contactUid)
	}
	return requestOptions
}

/**
 * PreSend hook to validate Uniqname in request
 * @param this - The context object
 * @param requestOptions - The request options object
 * @returns The request options object
 */
export async function preSendValidateUniqnameInRequest(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions
): Promise<IHttpRequestOptions> {
	const uniqname = this.getNodeParameter("uniqname") as string
	if (uniqname) {
		validateUniqname(uniqname)
	}
	return requestOptions
}

/**
 * PreSend hook to validate Responsible Group ID in request
 * @param this - The context object
 * @param requestOptions - The request options object
 * @returns The request options object
 */
export async function preSendValidateResponsibleGroupIdInRequest(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions
): Promise<IHttpRequestOptions> {
	const responsibleGroupId = this.getNodeParameter(
		"responsibleGroupId"
	) as string
	if (responsibleGroupId) {
		validateNumericId(String(responsibleGroupId), "Responsible Group ID")
	}
	return requestOptions
}

/**
 * PreSend hook to validate Requestor Email in request
 * @param this - The context object
 * @param requestOptions - The request options object
 * @returns The request options object
 */
export async function preSendValidateRequestorEmailInRequest(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions
): Promise<IHttpRequestOptions> {
	const requestorEmail = this.getNodeParameter("requestorEmail") as string
	if (requestorEmail) {
		validateEmail(requestorEmail, "Requestor Email")
	}
	return requestOptions
}

/**
 * PreSend hook to validate Service ID in request
 * @param this - The context object
 * @param requestOptions - The request options object
 * @returns The request options object
 */
export async function preSendValidateServiceIdInRequest(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions
): Promise<IHttpRequestOptions> {
	const serviceId = this.getNodeParameter("serviceId") as string
	if (serviceId) {
		validateNumericId(String(serviceId), "Service ID")
	}
	return requestOptions
}

/**
 * PreSend hook to validate Source ID in request
 * @param this - The context object
 * @param requestOptions - The request options object
 * @returns The request options object
 */
export async function preSendValidateSourceIdInRequest(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions
): Promise<IHttpRequestOptions> {
	const sourceId = this.getNodeParameter("sourceId") as string
	if (sourceId) {
		validateSourceId(String(sourceId))
	}
	return requestOptions
}

/**
 * PreSend hook to validate Status ID in request
 * @param this - The context object
 * @param requestOptions - The request options object
 * @returns The request options object
 */
export async function preSendValidateStatusIdInRequest(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions
): Promise<IHttpRequestOptions> {
	const statusId = this.getNodeParameter("statusId") as string
	if (statusId) {
		validateNumericId(String(statusId), "Status ID")
	}
	return requestOptions
}

/**
 * PreSend hook to validate Ticket Creation Fields in request
 * @param this - The context object
 * @param requestOptions - The request options object
 * @returns The request options object
 */
export async function preSendValidateTicketCreationFieldsInRequest(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions
): Promise<IHttpRequestOptions> {
	// Validate text fields length
	const title = this.getNodeParameter("title") as string
	const description = this.getNodeParameter("description") as string

	if (title) {
		validateTextLength(title, "Title", 500)
	}
	if (description) {
		validateTextLength(description, "Description")
	}

	return requestOptions
}

/**
 * PreSend hook to validate Comment in request
 * @param this - The context object
 * @param requestOptions - The request options object
 * @returns The request options object
 */
export async function preSendValidateCommentInRequest(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions
): Promise<IHttpRequestOptions> {
	const comments = this.getNodeParameter("comments") as string
	if (comments) {
		validateTextLength(comments, "Comment")
	}
	return requestOptions
}

/**
 * PreSend hook to validate Search Text in request
 * @param this - The context object
 * @param requestOptions - The request options object
 * @returns The request options object
 */
export async function preSendValidateSearchTextInRequest(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions
): Promise<IHttpRequestOptions> {
	const searchText = this.getNodeParameter("searchText") as string
	if (searchText) {
		validateTextLength(searchText, "Search Text")
	}
	return requestOptions
}

/**
 * PreSend hook to turn comma-separated list of status IDs into an array and validate each ID
 * @param this - The context object
 * @param requestOptions - The request options object
 * @returns The request options object
 */
export async function preSendValidateStatusIdsInRequest(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions
): Promise<IHttpRequestOptions> {
	const addlParams = this.getNodeParameter("additionalParameters") as Record<
		string,
		unknown
	>
	const statusIds = addlParams.statusIds as string

	if (!statusIds) {
		return requestOptions
	}

	// Parse the comma-separated list into an array of numeric IDs and validate each ID
	const idsArray = parseCommaSeparatedNumericIds(statusIds, "Status IDs")

	// Now set the array of status IDs in the request options body, replacing the comma-separated string
	const body = requestOptions.body as Record<string, unknown>
	body.statusIds = idsArray

	return requestOptions
}

/**
 * PreSend hook to validate Ticket Classification in request
 * @param this - The context object
 * @param requestOptions - The request options object
 * @returns The request options object
 */
export async function preSendValidateTicketClassificationInRequest(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions
): Promise<IHttpRequestOptions> {

	const addlParams = this.getNodeParameter("additionalParameters") as Record<
		string,
		unknown
	>
	const ticketClassification = addlParams.ticketClassification as string
	if (ticketClassification) {
		validateTextLength(ticketClassification, "Ticket Classification", 255)
	}
	return requestOptions
}

/**
 * PreSend hook to turn comma-separated list of service IDs into an array and validate each ID
 * @param this - The context object
 * @param requestOptions - The request options object
 * @returns The request options object
 */
export async function preSendValidateServiceIdsInRequest(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions
): Promise<IHttpRequestOptions> {
	const addlParams = this.getNodeParameter("additionalParameters") as Record<
		string,
		unknown
	>
	const serviceIds = addlParams.serviceIds as string

	if (!serviceIds) {
		return requestOptions
	}

	// Parse the comma-separated list into an array of numeric IDs and validate each ID
	const idsArray = parseCommaSeparatedNumericIds(serviceIds, "Service IDs")

	// Now set the array of service IDs in the request options body, replacing the comma-separated string
	const body = requestOptions.body as Record<string, unknown>
	body.serviceIds = idsArray

	return requestOptions
}

/**
 * PreSend hook to turn comma-separated list of location IDs into an array and validate each ID
 * @param this - The context object
 * @param requestOptions - The request options object
 * @returns The request options object
 */
export async function preSendValidateLocationIdsInRequest(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions
): Promise<IHttpRequestOptions> {
	const addlParams = this.getNodeParameter("additionalParameters") as Record<
		string,
		unknown
	>
	const locationIds = addlParams.locationIds as string

	if (!locationIds) {
		return requestOptions
	}

	// Parse the comma-separated list into an array of numeric IDs and validate each ID
	const idsArray = parseCommaSeparatedNumericIds(locationIds, "Location IDs")

	// Now set the array of location IDs in the request options body, replacing the comma-separated string
	const body = requestOptions.body as Record<string, unknown>
	body.locationIds = idsArray

	return requestOptions
}

/**
 * PreSend hook to turn comma-separated list of account IDs into an array and validate each ID
 * @param this - The context object
 * @param requestOptions - The request options object
 * @returns The request options object
 */
export async function preSendValidateAccountIdsInRequest(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions
): Promise<IHttpRequestOptions> {

	const addlParams = this.getNodeParameter("additionalParameters") as Record<
		string,
		unknown
	>
	const accountIds = addlParams.accountIds as string

	if (!accountIds) {
		return requestOptions
	}

	// Parse the comma-separated list into an array of numeric IDs and validate each ID
	const idsArray = parseCommaSeparatedNumericIds(accountIds, "Account IDs")

	// Now set the array of account IDs in the request options body, replacing the comma-separated string
	const body = requestOptions.body as Record<string, unknown>
	body.accountIds = idsArray
	return requestOptions
}

/**
 * PreSend hook to turn comma-separated list of requestor UIDs into an array and validate each ID
 * @param this - The context object
 * @param requestOptions - The request options object
 * @returns The request options object
 */
export async function preSendValidateRequestorUidsInRequest(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions
): Promise<IHttpRequestOptions> {
	const addlParams = this.getNodeParameter("additionalParameters") as Record<
		string,
		unknown
	>
	const requestorUids = addlParams.requestorUids as string

	if (!requestorUids) {
		return requestOptions
	}

	// Parse the comma-separated list into an array of numeric IDs and validate each ID
	const idsArray = parseCommaSeparatedStrings(requestorUids, "Requestor UIDs")

	// Now set the array of requestor UIDs in the request options body, replacing the comma-separated string
	const body = requestOptions.body as Record<string, unknown>
	body.requestorUids = idsArray

	return requestOptions
}

/**
 * PreSend hook to turn comma-separated list of responsibility UIDs into an array and validate each ID
 * @param this - The context object
 * @param requestOptions - The request options object
 * @returns The request options object
 */
export async function preSendValidateResponsibilityUidsInRequest(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions
): Promise<IHttpRequestOptions> {
	const addlParams = this.getNodeParameter("additionalParameters") as Record<
		string,
		unknown
	>
	const responsibilityUids = addlParams.responsibilityUids as string

	if (!responsibilityUids) {
		return requestOptions
	}

	// Parse the comma-separated list into an array of numeric IDs and validate each ID
	const idsArray = parseCommaSeparatedStrings(responsibilityUids, "Responsibility UIDs")

	// Now set the array of responsibility UIDs in the request options body, replacing the comma-separated string
	const body = requestOptions.body as Record<string, unknown>
	body.responsibilityUids = idsArray
	return requestOptions
}

/**
 * PreSend hook to turn comma-separated list of responsibility group IDs into an array and validate each ID
 * @param this - The context object
 * @param requestOptions - The request options object
 * @returns The request options object
 */
export async function preSendValidateResponsibilityGroupIdsInRequest(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions
): Promise<IHttpRequestOptions> {

	const addlParams = this.getNodeParameter("additionalParameters") as Record<
		string,
		unknown
	>
	const responsibilityGroupIds = addlParams.responsibilityGroupIds as string

	if (!responsibilityGroupIds) {
		return requestOptions
	}

	// Parse the comma-separated list into an array of strings and validate each string
	const idsArray = parseCommaSeparatedStrings(responsibilityGroupIds, "Responsibility Group IDs")

	// Now set the array of responsibility group IDs in the request options body, replacing the comma-separated string
	const body = requestOptions.body as Record<string, unknown>
	body.responsibilityGroupIds = idsArray
	return requestOptions
}

/**
 * PreSend hook to validate Requestor Name Search in request
 * @param this - The context object
 * @param requestOptions - The request options object
 * @returns The request options object
 */
export async function preSendValidateRequestorNameSearchInRequest(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions
): Promise<IHttpRequestOptions> {

	const addlParams = this.getNodeParameter("additionalParameters") as Record<
		string,
		unknown
	>
	const requestorNameSearch = addlParams.requestorNameSearch as string
	if (requestorNameSearch) {
		validateTextLength(requestorNameSearch, "Requestor Name Search")
	}
	return requestOptions
}

/**
 * PreSend hook to validate Requestor Email Search in request
 * @param this - The context object
 * @param requestOptions - The request options object
 * @returns The request options object
 */
export async function preSendValidateRequestorEmailSearchInRequest(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions
): Promise<IHttpRequestOptions> {
	const addlParams = this.getNodeParameter("additionalParameters") as Record<
		string,
		unknown
	>
	const requestorEmailSearch = addlParams.requestorEmailSearch as string
	if (requestorEmailSearch) {
		validateEmail(requestorEmailSearch, "Requestor Email Search")
	}
	return requestOptions
}

/**
 * Parses a comma-separated list of numeric IDs into an array and validates each ID
 * @param list - The comma-separated list of numeric IDs to parse
 * @param fieldLabel
 * @returns
 */
function parseCommaSeparatedNumericIds(
	list: string,
	fieldLabel: string
): number[] {
	const ids = list
		.split(",")
		.map((id) => id.trim())
		.filter(Boolean)
	ids.forEach((id) => validateNumericId(id, fieldLabel))
	return ids.map(Number)
}

/**
 * Parses a comma-separated list of strings into an array
 * @param list - The comma-separated list of strings to parse
 * @param fieldLabel
 * @returns
 */
function parseCommaSeparatedStrings(
	list: string,
	fieldLabel: string
): string[] {
	const strings = list
		.split(",")
		.map((string) => string.trim())
		.filter(Boolean)
	strings.forEach((string) => validatePathSegment(string, fieldLabel))
	return strings
}
