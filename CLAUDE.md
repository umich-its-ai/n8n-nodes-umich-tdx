# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

n8n community node for University of Michigan TeamDynamix (TDX) API. Provides ticket operations (search, create, modify), report search, user lookup, and attachment download via OAuth2 client credentials against U-M API Gateway.

## Commands

```bash
npm run build          # Compile TypeScript → dist/
npm run build:watch    # Watch mode compilation
npm run dev            # n8n development mode
npm run lint           # ESLint check
npm run lint:fix       # ESLint auto-fix
npm run release        # Publish to npm
```

Local dev rebuild (rebuilds node + restarts Docker n8n):
```bash
./rebuild.sh
```
> Prereqs: Docker running, local n8n instance at `~/n8n`, project at `~/umich-its-ai/...`. Paths are hardcoded — only works on the original dev machine.

No test framework configured — no unit tests exist.

## Architecture

```
credentials/         → OAuth2 credential definition (test/prod environments)
nodes/UmichTdx/     → Main node class (INodeType), metadata JSON, icon
resources/           → Operation definitions per resource (ticketSearch, ticketCreation, ticketModification, userLookup, reportSearch, attachment)
fields/              → Field definitions; `additionalFields.ts` has 6 optional boolean params for ticket creation (routed via `routing.request.qs`); `commonFields.ts` is empty placeholder
helpers/             → authentication.ts (base URL routing), validation.ts (pre-send input validators), attachments.ts (binary download preSend/postReceive)
```

### How it works

1. Single node class (`UmichTdx.node.ts`) aggregates all resources and fields via `allResources` + `allFields` arrays
2. Each resource file defines operations with declarative HTTP routing (`routing.request` and `routing.send.preSend` hooks)
3. Validation runs via pre-send hooks before HTTP requests — no execute method; entirely declarative/routing-based
4. Credential handles OAuth2 token lifecycle; environment (test/prod) switches base URLs and token endpoints

### Key patterns

- **Declarative HTTP node**: Uses n8n's routing system, not a custom `execute()` method
- **Pre-send validation**: All validation in `helpers/validation.ts` via `INodeRequestSend` pre-send hooks. Every operation chains `[setBaseApiUrl, ...resourceValidators]` in `routing.send.preSend` — base URL must be first.
- **Environment switching**: Credential stores environment choice; `setBaseApiUrl()` pre-send hook reads it to set `requestOptions.baseURL`
- **Security constraints**: @umich.edu email enforcement, numeric ID validation, path segment sanitization; title ≤500 chars, description/comments ≤2000 chars
- **Source ID locked to 8**: Ticket creation hardcodes SourceID=8 (Systems) — validated server-side. statusId defaults to 0 (hidden field). Do not expose these.
- **Binary attachment downloads**: Attachment resource uses `GET attachments/{id}/content`. Chain `[setBaseApiUrl, preSendValidateAttachmentIdInRequest, prepareAttachmentDownloadRequest]` in preSend; `preSendValidateAttachmentIdInRequest` validates the UUID path segment via `validatePathSegment`; `prepareAttachmentDownloadRequest` sets `json: false`, `encoding: 'arraybuffer'`, `Accept: */*`, and removes inherited `Content-Type`. Custom `transformAttachmentToBinary` postReceive converts response to Buffer, calls `prepareBinaryData`, outputs `$binary.data`. Global `requestDefaults` still send JSON headers for other operations — attachment op overrides per-request.
- **Attachment constraints**: Attachment IDs are UUIDs (not numeric). Extension allowlist and 20 MB size cap enforced in `transformAttachmentToBinary` after download. Pass `fileName` from upstream Code node for correct metadata in Drive/upload nodes.

### n8n loading

Package.json `n8n` section declares entry points:
- `dist/credentials/UmichTdxOAuth2Api.credentials.js`
- `dist/nodes/UmichTdx/UmichTdx.node.js`

n8n discovers and loads these at startup.

## Release Process

1. `npm version patch|minor|major`
2. Update CHANGELOG.md
3. Git push + tag
4. `npm run release`

See `VERSION_PATCH_README.md` for detailed steps (npm version bump, changelog, tag, publish).
