# Version bump and release guide

How to bump the version, update `CHANGELOG.md`, and publish `n8n-nodes-umich-tdx` so npm serves the new release.

## What npm actually uses

| File / field | Role |
|--------------|------|
| `package.json` → `"version"` | **This is what npm publishes.** `npm install n8n-nodes-umich-tdx@1.0.9` resolves to this string. |
| `package-lock.json` | Should stay in sync with `package.json` when you use `npm version`. |
| `CHANGELOG.md` | Human-readable history. Not used for version resolution; still shipped with the package. |
| `dist/` | Built output; included via `"files": ["dist"]`. Built automatically before publish via `prepublishOnly`. |

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
- You are logged in to npm (`npm whoami`) and have publish rights to `n8n-nodes-umich-tdx`.
- Dependencies are installed (`npm ci` or `npm install`).

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

`npm run release` will run prerelease checks again; catching issues early saves a failed publish.

### 3. Bump the version

Pick one:

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

Then commit `package.json`, `package-lock.json`, and `CHANGELOG.md` yourself.

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

```bash
git push origin main
git push origin --tags
```

Skip tag push if you used `--no-git-tag-version` and are not tagging.

### 6. Publish to npm

Use the n8n community node release script (runs `n8n-node prerelease` via `prepublishOnly`, then publishes):

```bash
npm run release
```

Equivalent to `n8n-node release` — publishes the version currently in `package.json`.

### 7. Verify

```bash
npm view n8n-nodes-umich-tdx version
```

Confirm it matches `package.json`. Install in a test n8n instance if needed.

## Quick checklist

- [ ] Code merged / committed
- [ ] `npm version patch` (or minor/major)
- [ ] `CHANGELOG.md` updated (auto-changelog or manual)
- [ ] `git push` + `git push --tags`
- [ ] `npm run release`
- [ ] `npm view n8n-nodes-umich-tdx version` matches

## Project scripts reference

| Script | What it does |
|--------|----------------|
| `npm run build` | Compiles TypeScript to `dist/` |
| `npm run lint` | Runs `n8n-node lint` |
| `prepublishOnly` → `n8n-node prerelease` | Runs automatically before `npm publish` / release |
| `npm run release` | `n8n-node release` — publish to npm |

## Common issues

**Publish fails: version already exists**  
You did not bump `package.json`, or you published this version earlier. Run `npm version patch` and publish again.

**Published wrong code**  
Version in npm is correct but tarball is old — you published before committing or before building. Bump patch again, ensure `dist/` is current (`npm run build`), republish.

**`npm version` fails: working tree not clean**  
Commit or stash changes first, or use `--no-git-tag-version` and commit manually.

**Changelog missing latest commits**  
Run `npx auto-changelog` after creating the version tag, or ensure commits are on the branch auto-changelog reads.

## Related files

- `package.json` — `version` field and release scripts
- `CHANGELOG.md` — release notes
- `README.md` — user-facing install and usage docs (update separately when behavior changes)
