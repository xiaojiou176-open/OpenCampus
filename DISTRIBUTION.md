# Distribution Readiness

Campus Copilot is already **repo-public ready** for review and staged publication.

Use this file as the shortest truthful routing page for distribution questions.

It is not the product front door.
It is the shipping counter:

- which entry path is already real
- which one is only repo-local proof today
- which ones still need owner-side publish or listing actions

## Current Matrix

| Surface | Best for | Current truthful state | First proof |
| :-- | :-- | :-- | :-- |
| Main repository + Pages | humans who want the front door first | public and GitHub Pages-backed | open the repo and homepage |
| `@campus-copilot/mcp-server` stdio route | Codex / Claude Code style generic MCP workflows | public-ready (repo-local) | `pnpm --filter @campus-copilot/mcp-server start --help` |
| Docker / container | local HTTP/health consumers that want the thin BFF in a container | container-ready (repo-local) | `docker build -t campus-copilot-api:local .` then `pnpm smoke:docker:api` |
| Browser extension | student-facing workbench | build-ready product surface | `pnpm --filter @campus-copilot/extension build` |
| CLI / sidecars / provider-runtime / site APIs | builder-facing package candidates | public-ready (repo-local) | `pnpm proof:public` |
| SDK / workspace-sdk / site-sdk | code-first study of the shared substrate | repo-public preview, registry blocked | `pnpm proof:public` |
| Public skill pack | prompt-first local builder workflows | public-ready (repo-local) with generic upstream packet ready | `pnpm check:skill-catalog` |
| Codex / Claude / OpenClaw bundles | plugin-grade local bundle routing | plugin-grade repo bundles | `pnpm proof:public` |

## Truthful Layer Split

- `packages/mcp-server` is the **stdio MCP path**.
- `apps/api` is the **HTTP + health path**.
- `Dockerfile` and `compose.yaml` intentionally containerize the **thin local BFF**, not the stdio server.
- the container proof loop is `pnpm smoke:docker:api`, not `pnpm start:mcp`
- `skills/catalog.json` is the **repo-owned skill pack index**. It is not an OpenClaw native plugin manifest and not a ClawHub listing by itself.
- `skills/clawhub-submission.packet.json` is the **repo-owned upstream packet** for later ClawHub-style submission. It is intentionally not a vendor-owned manifest.
- `docs/skill-publication-prep.md` is the focused human-readable packet for that same skill publication lane.
- `packages/mcp-server/registry-submission.packet.json` plus `pnpm check:mcp-registry-preflight` are the **registry-submit preflight** artifacts for the stdio MCP path.
- `docs/mcp-registry-submission-prep.md` is the focused human-readable packet for that same MCP Registry lane.
- `docs/container-publication.packet.json` captures the canonical image naming, OCI labels, and truth boundary for the thin local BFF image.
- `docs/container-publication-prep.md` is the focused human-readable packet for the same image-publication lane.
- [`docs/16-distribution-preflight-packets.md`](docs/16-distribution-preflight-packets.md) is the consolidated human-readable packet ledger for all three publication paths.

## Root Package Posture

The root `package.json` is intentionally:

- `private: true`
- `version: 0.1.0`
- source-first, not a publish artifact

That is deliberate.
The root package is the monorepo entry and verification shell.
Actual publish candidates live under `packages/*`, the extension build output, the skill pack, or the container path.

## Docker / Container Path

Use the container route only when you want the **thin local BFF** as an HTTP + health surface:

```bash
docker compose up -d campus-copilot-api
pnpm smoke:docker:api
```

Runtime constraints:

- the containerized path is for `apps/api`, not for the stdio MCP server
- `HOST=0.0.0.0` is intentional inside the container so the health surface is reachable
- `PORT` defaults to `8787`
- provider env vars stay optional; `/health` works without them and `/api/providers/status` reports readiness truthfully

Canonical image naming:

- local smoke tag: `campus-copilot-api:local`
- canonical public image coordinate: `ghcr.io/xiaojiou176-open/campus-copilot-api`
- recommended public tags: `0.1.0`, `0.1`, `latest`
- optional owner-chosen mirror: `<owner-controlled-namespace>/campus-copilot-api`

Repo-side publication packet:

- [`docs/container-publication.packet.json`](docs/container-publication.packet.json)
- [`docs/container-publication-prep.md`](docs/container-publication-prep.md)
- `pnpm check:container-surface`

## Read In This Order

1. [`README.md`](README.md)
2. [`docs/14-public-distribution-scoreboard.md`](docs/14-public-distribution-scoreboard.md)
3. [`docs/15-publication-submission-packet.md`](docs/15-publication-submission-packet.md)
4. [`docs/16-distribution-preflight-packets.md`](docs/16-distribution-preflight-packets.md)
5. [`docs/chrome-web-store-submission-packet.md`](docs/chrome-web-store-submission-packet.md)
9. [`INTEGRATIONS.md`](INTEGRATIONS.md)
10. [`PRIVACY.md`](PRIVACY.md)

## Owner-Only Later Bucket

These do **not** block repo readiness:

- package publication beyond what the repo can already prove locally
- official MCP Registry submission
- official marketplace or listing submission
- Chrome Web Store submission click-through
- Docker Hub / Glama or other directory-side publish actions
- promo video / announcement / off-repo launch

Repo-side preflight commands that should stay green before those later actions:

- `pnpm check:skill-catalog`
- `pnpm check:mcp-registry-preflight`
- `pnpm check:container-surface`

## Browser Extension Readiness

The browser extension is now best described as:

- manifest present
- permissions intentionally narrow
- read-only product contract
- deterministic build/test lane present
- ready for final store packaging and review preparation

The remaining owner-side last mile is:

- final store listing copy and screenshot ordering review
- Chrome Web Store submission
- any store-console privacy declarations that require maintainer clicks

## Rules

- Do not call `public-ready (repo-local)` the same thing as `published`.
- Do not call `container-ready (repo-local)` the same thing as hosted SaaS.
- Do not call plugin-grade repo bundles official marketplace plugins.
- Do not call the skill pack catalog an upstream marketplace manifest unless the upstream registry actually requires that exact shape.
- Keep distribution wording narrower than the product story on the front door.
