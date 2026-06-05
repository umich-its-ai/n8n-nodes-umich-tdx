# Version bump and release guide

How to bump the version, update `CHANGELOG.md`, and publish `n8n-nodes-umich-tdx` to npm with **provenance** via GitHub Actions.

## How publishing works

| Where | What happens |
|-------|----------------|
| **Your machine** | Bump version, update changelog, commit, tag (`v*`), push. **Does not publish to npm.** |
| **GitHub Actions** | Tag push runs `.github/workflows/publish.yaml` → lint, build, `npm publish` with provenance. |

**Provenance** is a signed attestation linking the npm tarball to this repo, commit, and workflow. n8n expects community nodes to be published this way (not from a local `npm publish`).

You do **not** need `npm login` on your laptop for routine releases if Trusted Publishing is configured on npmjs.com.

## One-time setup (npm + GitHub)

Pick **one** auth method on [npmjs.com](https://www.npmjs.com/package/n8n-nodes-umich-tdx) → package **Settings**:

### Option A — Trusted Publishing (recommended)

Under **Trusted Publishers** → GitHub Actions:

| Field | Value |
|-------|--------|
| Owner | `umich-its-ai` |
| Repository | `n8n-nodes-umich-tdx` |
| Workflow filename | `publish.yaml` (must match exactly) |
| Environment | leave blank unless you use a GitHub Environment |

Leave `NPM_TOKEN` unset in the GitHub repo. The workflow uses OIDC (`id-token: write`).

### Option B — npm token (fallback)

1. Create a granular npm token with publish access to this package.
2. Add it as GitHub repo secret `NPM_TOKEN`.

Docs: [n8n — Publishing to npm](https://docs.n8n.io/integrations/creating-nodes/deploy/submit-community-nodes/) · [npm Trusted Publishers](https://docs.npmjs.com/trusted-publishers/)

**Requirements:** `@n8n/node-cli` ≥ `0.23.0` (this repo pins `^0.33.0`). Regenerate `package-lock.json` with npm 11 when dependencies change (`npx npm@11 install`) so CI `npm ci` stays in sync.

## What npm actually uses

| File / field | Role |
|--------------|------|
| `package.json` → `"version"` | **This is what npm publishes.** `npm install n8n-nodes-umich-tdx@1.0.9` resolves to this string. |
| `package-lock.json` | Should stay in sync with `package.json` when you use `npm version`. |
| `CHANGELOG.md` | Human-readable history. Not used for version resolution; still shipped with the package. |
| `dist/` | Built output; included via `"files": ["dist"]`. CI builds before publish via `prepublishOnly` / release step. |

If you publish without bumping `package.json`, npm will reject the publish (version already exists) or you will ship the wrong version.

## Semver: patch, minor, or major

Follow [semver](https://semver.org/) for `MAJOR.MINOR.PATCH`:

| Change type | Command | Example |
|-------------|---------|---------|
| Bug fix, docs, internal-only | `npm version patch` | 1.0.8 → 1.0.9 |
| New backward-compatible behavior | `npm version minor` | 1.0.8 → 1.1.0 |
| Breaking API / credential / node behavior | `npm version major` | 1.0.8 → 2.0.0 |

Use **patch** for most routine releases of this community node.

## Prerequisites

- All intended code changes are **committed** on the branch you release from (usually `main`).
- Working tree is **clean** (`git status` shows nothing to commit), unless you are about to commit the version bump itself.
- Dependencies installed locally for lint/build checks (`npm ci` or `npm install`).
- GitHub Actions **Publish to npm** workflow has succeeded at least once after Trusted Publishing / `NPM_TOKEN` setup.

## Standard release workflow (recommended)

Run these from the repo root:

```bash
cd /path/to/n8n-nodes-umich-tdx
```

### 1. Finish feature work

Commit and push your changes. Do not bump the version until the release content is ready.

### 2. Lint and build (optional but good practice)

```bash
npm run lint
npm run build
```

CI runs these again before publish; catching issues early avoids a failed workflow.

### 3. Bump the version

**Option A — manual (common):**

```bash
npm version patch    # 1.0.x → 1.0.(x+1)
npm version minor    # 1.x.0 → 1.(x+1).0
npm version major    # x.0.0 → (x+1).0.0
```

By default, `npm version` will:

- Update `version` in `package.json`
- Update `package-lock.json`
- Create a git commit (message like `1.0.9`)
- Create a git tag (e.g. `v1.0.9` — depends on your npm `tag-version-prefix` config)

To bump without auto-commit/tag (you commit manually):

```bash
npm version patch --no-git-tag-version
```

Then commit `package.json`, `package-lock.json`, and `CHANGELOG.md` yourself, and create the tag: `git tag v1.0.9`.

**Option B — interactive (`n8n-node` / release-it):**

```bash
npm run release
```

On your machine this runs release-it: lint, build, version bump prompt, changelog, commit, tag, and push. It **does not** publish to npm (`--npm.publish=false`). Pushing the tag still triggers CI to publish.

Do **not** use `npm run release --publish` unless you intentionally want a local publish **without** provenance.

### 4. Update `CHANGELOG.md`

This repo’s changelog is generated with [auto-changelog](https://github.com/CookPete/auto-changelog). After bumping and tagging, regenerate:

```bash
npx auto-changelog
```

Review the new top section in `CHANGELOG.md`. Edit wording if commit messages are unclear.

If you do not use auto-changelog for a release, add a section manually under the header, matching existing format:

```markdown
#### [v1.0.9](https://github.com/umich-its-ai/n8n-nodes-umich-tdx/compare/v1.0.8...v1.0.9)

- Short description of what changed
```

Commit the changelog if `npm version` did not include it:

```bash
git add CHANGELOG.md
git commit -m "docs: update changelog for v1.0.9"
```

### 5. Push commits and tags

Tags must match the workflow filter: `v*` (e.g. `v1.1.3`).

```bash
git push origin main
git push origin --tags
```

Pushing the version tag starts **Publish to npm** on GitHub Actions.

### 6. Wait for CI to publish (do not publish locally)

Open **Actions** → **Publish to npm** for the tag you pushed. When the job succeeds, the package is on npm with provenance. No further publish step is required.

The workflow runs `npm run release`, which in CI (`GITHUB_ACTIONS=true`) executes lint, build, and `npm publish` with `NPM_CONFIG_PROVENANCE=true`. Plain `npm publish` from your machine is blocked by `prepublishOnly` unless `RELEASE_MODE` is set (CI sets it).

### 7. Verify

```bash
npm view n8n-nodes-umich-tdx version
```

Confirm it matches `package.json`. On [npmjs.com/package/n8n-nodes-umich-tdx](https://www.npmjs.com/package/n8n-nodes-umich-tdx), check **Provenance** / build details point at this repo and workflow.

Install in a test n8n instance if needed.

## Quick checklist

- [ ] Code merged / committed
- [ ] `npm version patch` (or minor/major), **or** `npm run release` locally
- [ ] `CHANGELOG.md` updated (auto-changelog or manual)
- [ ] `git push origin main` + `git push origin --tags` (tag `v*`)
- [ ] GitHub Actions **Publish to npm** succeeded for that tag
- [ ] `npm view n8n-nodes-umich-tdx version` matches `package.json`

## Project scripts reference

| Script | Local | In CI (`publish.yaml`) |
|--------|--------|-------------------------|
| `npm run build` | Compile TypeScript to `dist/` | Same (via `npm run release`) |
| `npm run lint` | `n8n-node lint` | Same |
| `npm run release` | Version bump, changelog, commit, tag, push — **no npm publish** | Lint, build, **`npm publish` with provenance** |
| `prepublishOnly` | Blocks direct `npm publish`; use CI or `RELEASE_MODE` | Runs during `npm publish` in CI |

## Common issues

**Workflow fails on `npm ci` (lock file out of sync)**  
Regenerate the lockfile with npm 11: `npx npm@11 install`, commit `package-lock.json`, retag or push a new tag.

**`Run npm run release to publish the package` in CI**  
Upgrade `@n8n/node-cli` to ≥ `0.23.0` and ensure CI runs `npm run release` (not bare `npm publish` without the new CLI).

**Not authenticated with npm (in CI)**  
Configure Trusted Publishing (`publish.yaml` name must match exactly) or set GitHub secret `NPM_TOKEN`.

**Publish fails: version already exists**  
You did not bump `package.json`, or CI already published this version. Bump again and push a new tag.

**Published wrong code**  
The tag pointed at a commit without your changes. Bump patch, ensure code is on `main`, push a new `v*` tag, wait for CI.

**`npm version` fails: working tree not clean**  
Commit or stash changes first, or use `--no-git-tag-version` and commit manually.

**Changelog missing latest commits**  
Run `npx auto-changelog` after creating the version tag, or ensure commits are on the branch auto-changelog reads.

**Re-run publish for the same version**  
npm will not accept a duplicate version. Either delete the tag on npm (not possible for published versions) or bump to the next patch and push a new tag.

## Related files

- `package.json` — `version` field and release scripts
- `.github/workflows/publish.yaml` — provenance publish on `v*` tags
- `CHANGELOG.md` — release notes
- `README.md` — user-facing install and usage docs (update separately when behavior changes)
