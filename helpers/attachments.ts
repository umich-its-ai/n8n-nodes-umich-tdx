import {
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	IN8nHttpFullResponse,
	INodeExecutionData
} from "n8n-workflow"

/**
 * Configure the HTTP request for binary attachment downloads.
 * Must run after setBaseApiUrl so baseURL is already set.
 */
export async function prepareAttachmentDownloadRequest(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions
): Promise<IHttpRequestOptions> {
	// The global headers default to application/json, so we need to override that for attachments
	requestOptions.json = false
	requestOptions.encoding = "arraybuffer"
	requestOptions.headers = {
		...requestOptions.headers,
		// Override default of application/json to accept all content types.
		Accept: "*/*"
	}

	// There is no body when getting a binary file.
	delete requestOptions.headers["Content-Type"]

	return requestOptions
}

/**
 * Convert the response body to a Buffer. A buffer keeps the bytes in the correct format (plain text can garble if not converted to a buffer).
 * @param body - The response body.
 * @returns The response body as a Buffer.
 */
function responseBodyToBuffer(body: unknown): Buffer {
	if (Buffer.isBuffer(body)) {
		return body
	}

	if (body instanceof ArrayBuffer) {
		return Buffer.from(body)
	}

	if (ArrayBuffer.isView(body)) {
		return Buffer.from(body.buffer, body.byteOffset, body.byteLength)
	}

	if (typeof body === "string") {
		// Preserve raw byte values if the client returned a binary string.
		return Buffer.from(body, "latin1")
	}

	throw new Error("Unexpected attachment response body type")
}

/**
 * Parse the file name from the content disposition header.
 * @param contentDisposition - The content disposition header.
 * @returns The file name.
 */
function parseFileName(contentDisposition?: string): string | undefined {
	if (!contentDisposition) {
		return undefined
	}

	const match = /filename\*?=(?:UTF-8''|"?)([^";]+)/i.exec(contentDisposition)
	if (!match?.[1]) {
		return undefined
	}

	return decodeURIComponent(match[1].replace(/"/g, ""))
}

/**
 * Turn the raw attachment HTTP response into n8n binary data with correct metadata.
 * @param this - The context object.
 * @param items - The items to transform.
 * @param response - The HTTP response.
 * @returns The transformed items.
 */
export async function transformAttachmentToBinary(
	this: IExecuteSingleFunctions,
	items: INodeExecutionData[],
	response: IN8nHttpFullResponse
): Promise<INodeExecutionData[]> {
	const body = responseBodyToBuffer(response.body)
	const contentType = (response.headers?.["content-type"] as string | undefined)
		?.split(";")[0]
		?.trim()
	const contentDisposition = response.headers?.["content-disposition"] as
		| string
		| undefined

	return Promise.all(
		items.map(async (item) => {
			const fileName =
				(item.json.fileName as string | undefined) ??
				parseFileName(contentDisposition)

			const ext = fileName?.split(".").pop()?.toLowerCase()
			const allowedExtensions = [
				"pdf",
				"jpg",
				"jpeg",
				"png",
				"gif",
				"webp",
				"doc",
				"docx",
				"xls",
				"xlsx",
				"ppt",
				"pptx",
				"txt",
				"csv",
				"tsv",
				"json",
				"xml",
				"html",
				"css",
				"js"
			]

			// Don't allow unsupported file extensions
			if (ext && !allowedExtensions.includes(ext)) {
				throw new Error(`Unsupported file extension: ${ext}`)
			}

			// Don't allow files > 20MB (body is a Buffer, so length is the number of bytes)
			if (body.length > 20 * 1024 * 1024) {
				throw new Error("File size exceeds 20MB limit")
			}

			// Prepare the binary data for the response (prepareBinaryData comes from the n8n-workflow package).
			const binaryData = await this.helpers.prepareBinaryData(
				body,
				fileName,
				contentType
			)

			return {
				json: {
					...item.json,
					fileName: fileName ?? binaryData.fileName,
					mimeType: contentType ?? binaryData.mimeType
				},
				binary: {
					data: binaryData
				}
			}
		})
	)
}
