# Publication Submission Packet

This file turns the current public-distribution truth into an owner-ready
submission packet.

It is an owner-action follow-up document, not a general front-door explainer.

Think of it like the shipping manifest after the loading dock has already been audited:

- [`14-public-distribution-scoreboard.md`](14-public-distribution-scoreboard.md) says which boxes are real
- this file says which box should go out first, where it could go, and what still requires an owner-controlled action

Use it only after the repo-local proof and distribution scoreboard are already
understood.

Use this file when the question is no longer "is the package real?" but:

> Which public-ready surface should leave the repository first, and what exact owner work is still required?

## Role Boundary

This packet is for owner-only publication sequencing:

- repo-local proof belongs in the scoreboard
- official listing or marketplace outcomes belong to upstream platforms
- this file only narrows the remaining owner-controlled submission path

## Current Candidate Set

These package surfaces are currently the strongest repo-local publication candidates:

| Surface | Current repo-local state | Why it is a candidate now | Why it is still not an official listing yet |
| :-- | :-- | :-- | :-- |
| `@campus-copilot/mcp` | `public-ready (repo-local)` + `registry candidate` | the config-helper package has a real README, proof loop, and sample route inside the repo | repo-local proof still does not itself prove a live npm page or official listing |
| `@campus-copilot/mcp-server` | `public-ready (repo-local)` + `registry candidate` | bundled standalone `dist/bin.mjs`, real help surface, repo-local proof path | an official MCP Registry submission still has to be executed; bundled server artifact is not the same thing as official listing |
| `@campus-copilot/mcp-readonly` | `public-ready (repo-local)` + `registry candidate` | bundled site sidecars now install and run through packaged `dist/*.js` bins | still not the same thing as an official MCP Registry listing |
| `@campus-copilot/cli` | `public-ready (repo-local)` + `registry candidate` | bundled CLI now builds, packs, installs, and runs outside the monorepo | npm/package publication still needs owner-controlled release action |
| `@campus-copilot/provider-runtime` | `public-ready (repo-local)` + `registry candidate` | no private runtime dependency remains; package exports now point at built `dist/` output | still only a seam package, not an official listing by itself |
| `@campus-copilot/gradescope-api` | `public-ready (repo-local)` + `registry candidate` | package now builds to `dist/`, packs cleanly, and has runnable usage proof | upstream publication still not executed |
| `@campus-copilot/edstem-api` | `public-ready (repo-local)` + `registry candidate` | package now builds to `dist/`, packs cleanly, and has runnable usage proof | upstream publication still not executed |
| `@campus-copilot/myuw-api` | `public-ready (repo-local)` + `registry candidate` | package now builds to `dist/`, packs cleanly, and has runnable usage proof | upstream publication still not executed |
| Public skill pack catalog | `public-ready (repo-local)` | machine-readable bundle catalog plus [`../skills/clawhub-submission.packet.json`](../skills/clawhub-submission.packet.json) and [`skill-publication-prep.md`](skill-publication-prep.md) now exist with deterministic validation | the repo now ships a generic upstream packet, but still does not claim a vendor-owned marketplace manifest |
| Docker API container | `container-ready (repo-local)` | Dockerfile, compose wiring, health smoke, OCI labels, [`container-publication.packet.json`](container-publication.packet.json), and [`container-publication-prep.md`](container-publication-prep.md) now exist for the thin local BFF | no container registry publication or platform-specific container listing has been executed |

## Publish Order

The current recommended publication order is:

1. `@campus-copilot/mcp-server`
2. `@campus-copilot/mcp`
3. `@campus-copilot/cli`
4. `@campus-copilot/mcp-readonly`
5. `@campus-copilot/provider-runtime`
6. `@campus-copilot/gradescope-api`
7. `@campus-copilot/edstem-api`
8. `@campus-copilot/myuw-api`

Why this order:

- `@campus-copilot/mcp-server` is the strongest MCP-server-shaped artifact for official registry prep because the official registry path is package-plus-`server.json`, not just config helpers
- `@campus-copilot/mcp` is still a good helper-package candidate, but it should not outrun the more canonical server artifact
- `@campus-copilot/cli` is a broad builder entrypoint, but still package-shaped instead of platform-shaped
- the sidecar/runtime/site-api packages are real and packable, but they are easier to overclaim if they go out before the MCP/core builder story is anchored

## Official Surface Map

| Target surface | Official public face exists? | Exact official URL | Current truthful repo-local status | Exact remaining owner step |
| :-- | :-- | :-- | :-- | :-- |
| MCP Registry | Yes | [registry.modelcontextprotocol.io](https://registry.modelcontextprotocol.io/) and [registry quickstart](https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/quickstart.mdx) | `@campus-copilot/mcp-server` is the strongest bundled server candidate for an official registry submission, while `@campus-copilot/mcp` remains a helper-package candidate only; the repo-side preflight packet now lives in [`../packages/mcp-server/registry-submission.packet.json`](../packages/mcp-server/registry-submission.packet.json) and [`16-distribution-preflight-packets.md`](16-distribution-preflight-packets.md) | decide whether `mcp-server` is the first official registry artifact, then publish/package it under owner-controlled credentials and execute the official submission flow |
| Codex ecosystem | Yes | [developers.openai.com/codex/ide](https://developers.openai.com/codex/ide) | repo already has a truthful Codex bundle/router path | no verified official third-party listing submission URL is currently recorded here; do not claim official listing yet |
| Claude Code ecosystem | Yes | [docs.anthropic.com/en/docs/claude-code/ide-integrations](https://docs.anthropic.com/en/docs/claude-code/ide-integrations) and [docs.anthropic.com/en/docs/claude-code/mcp](https://docs.anthropic.com/en/docs/claude-code/mcp) | repo already has truthful Claude bundle/router paths | no verified official third-party listing submission URL is currently recorded here; do not claim official listing yet |
| OpenClaw / ClawHub | Yes | [docs.openclaw.ai/tools/clawhub](https://docs.openclaw.ai/tools/clawhub) and [docs.openclaw.ai/plugins/bundles](https://docs.openclaw.ai/plugins/bundles) | repo already has a plugin-grade compatible bundle route via the existing Claude-style layout plus the repo-owned skill catalog and generic packet [`../skills/clawhub-submission.packet.json`](../skills/clawhub-submission.packet.json) | no verified upstream publication/submission URL is currently recorded here; do not claim official listing yet |
| Glama directory | Yes | [glama.ai/mcp/servers](https://glama.ai/mcp/servers) | repo now has generic packet-ready inputs recorded in [`16-distribution-preflight-packets.md`](16-distribution-preflight-packets.md), but no vendor-specific manifest was generated | no stable official submission schema was recovered in this wave, so keep Glama on the generic-packet path |

## Owner Action Cards

| Action | Why owner-only | Exact local path | Exact next step |
| :-- | :-- | :-- | :-- |
| Decide the first package publication | only the owner should choose which package really leaves the repo first | [`../packages/mcp-server/package.json`](../packages/mcp-server/package.json) and [`../packages/mcp/package.json`](../packages/mcp/package.json) | decide whether the first external package move is the canonical MCP server artifact or the smaller config-helper route, then publish it under owner-controlled credentials |
| Prepare an official MCP Registry submission | requires real upstream submission action, not just repo-local proof | [`../packages/mcp-server/package.json`](../packages/mcp-server/package.json), [`../packages/mcp-server/server.json`](../packages/mcp-server/server.json), [`../packages/mcp-server/registry-submission.packet.json`](../packages/mcp-server/registry-submission.packet.json), and [`16-distribution-preflight-packets.md`](16-distribution-preflight-packets.md) | decide whether `mcp-server` is the first official registry artifact, then publish and submit it through the official registry flow |
| Publish the Docker API container | requires owner credentials and platform-side image or listing choices | [`../Dockerfile`](../Dockerfile), [`../compose.yaml`](../compose.yaml), [`container-publication.packet.json`](container-publication.packet.json), [`16-distribution-preflight-packets.md`](16-distribution-preflight-packets.md), and [`../scripts/docker-api-smoke.sh`](../scripts/docker-api-smoke.sh) | build and smoke the image locally, then push it to the chosen registry or platform under owner-controlled credentials |
| Publish the public skill pack to a skill hub | requires the target platform's exact publish flow and credentials | [`../skills/catalog.json`](../skills/catalog.json), [`../skills/README.md`](../skills/README.md), [`../skills/clawhub-submission.packet.json`](../skills/clawhub-submission.packet.json), and [`16-distribution-preflight-packets.md`](16-distribution-preflight-packets.md) | treat the current packet as repo-owned input, then provide the exact owner-side publish flags required by that platform |
| Publish the broader builder surfaces | requires owner-controlled package publication and release policy | [`14-public-distribution-scoreboard.md`](14-public-distribution-scoreboard.md) | move down the publish order only after the earlier package surfaces have actually left the repo |
| Claim any official listing / marketplace status | requires a real upstream listing outcome, not just local package readiness | [`14-public-distribution-scoreboard.md`](14-public-distribution-scoreboard.md) | only switch wording to `officially listed` or `marketplace listed` after the upstream directory actually shows the package |

## Rules

- Do not treat `registry candidate` as `already published`.
- Do not treat package publication as `officially listed`.
- Do not skip the scoreboard. Every publication decision should still be cross-checked against [`14-public-distribution-scoreboard.md`](14-public-distribution-scoreboard.md).
- Do not publish a package just because it is technically possible. Publish in the order above unless a stronger owner decision overrides it.
