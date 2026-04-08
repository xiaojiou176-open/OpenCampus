# Distribution Preflight Packets

This file is the repo-side preflight ledger for the remaining publication-facing
surfaces.

Think of it like the final packing table before a package leaves the warehouse:

- the front door still explains what the product is
- the scoreboard still says which boxes are real
- this file says which exact submission packet is ready, which official contract
  it mirrors, and where owner-only action still begins

It does **not** claim that any marketplace, registry, or directory submission
has already happened.

## Current Packet Set

| Surface | Repo-side packet | Why it exists | Current truthful state |
| :-- | :-- | :-- | :-- |
| MCP Registry | [`../packages/mcp-server/registry-submission.packet.json`](../packages/mcp-server/registry-submission.packet.json) | mirrors the official `package.json` + `server.json` + stdio package path before `mcp-publisher publish` | `registry-ready (repo-local)` |
| OpenClaw / ClawHub skill publication | [`../skills/clawhub-submission.packet.json`](../skills/clawhub-submission.packet.json) | mirrors the official `clawhub skill publish` inputs and OpenClaw bundle-detection facts without inventing a vendor manifest | `generic upstream packet ready` |
| Docker / image publication | [`container-publication.packet.json`](container-publication.packet.json) | records the canonical local tag, canonical public GHCR coordinate, OCI labels, and image truth boundary | `container-publication-prepared` |
| Glama directory | reuse the three packets above plus [`14-public-distribution-scoreboard.md`](14-public-distribution-scoreboard.md) | Glama has an official directory and add-server flow, but this wave did **not** recover a stable vendor manifest or submission schema | `generic submission packet ready` |

## MCP Registry Preflight

Official sources:

- [MCP Registry quickstart](https://modelcontextprotocol.io/registry/quickstart)
- [Official `server.json` schema](https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json)

What the official path actually requires from the repo side:

| Level | Requirement | Why it matters |
| :-- | :-- | :-- |
| required | npm package published before registry submit | the registry hosts metadata, not package artifacts |
| required | `package.json` contains `mcpName` | the quickstart uses it for registry identity validation |
| required | `server.json.name == package.json.mcpName` | the quickstart states they must match |
| required | `server.json.packages[*].registryType/identifier/version/transport` align with the package | this is the install surface the registry validates |
| strongly recommended | `repository.subfolder` in monorepos | the official schema supports it for nested package paths |
| strongly recommended | README + example config + truthful boundary note | keeps submit copy and install proof aligned |

What Campus Copilot now ships for this path:

- canonical package: `@campus-copilot/mcp-server`
- transport: `stdio`
- official metadata artifacts:
  - [`../packages/mcp-server/package.json`](../packages/mcp-server/package.json)
  - [`../packages/mcp-server/server.json`](../packages/mcp-server/server.json)
  - [`../packages/mcp-server/registry-submission.packet.json`](../packages/mcp-server/registry-submission.packet.json)
- deterministic repo-side check:
  - `pnpm check:mcp-registry-preflight`

Owner-only later:

1. publish the package to npm
2. authenticate with `mcp-publisher login github`
3. submit with `mcp-publisher publish`

## OpenClaw / ClawHub Skill Publication

Official sources:

- [ClawHub](https://docs.openclaw.ai/tools/clawhub)
- [Skills](https://docs.openclaw.ai/tools/skills)
- [Plugin Bundles](https://docs.openclaw.ai/plugins/bundles)

The official contract is narrower than people usually assume:

| Question | Official answer | Repo-side action |
| :-- | :-- | :-- |
| Does every skill need a vendor manifest file? | No stable vendor manifest was recovered for plain ClawHub skill publish. The docs describe a skill as a directory with `SKILL.md`, optional files, plus metadata such as tags/summary/install requirements. | do **not** invent `manifest.yaml` |
| What does `clawhub skill publish` actually need? | path + `--slug` + `--name` + `--version` + optional `--changelog` + `--tags` | mirror those fields in a repo-owned packet |
| Are bundles supported without a manifest? | Yes. OpenClaw documents a manifestless Claude bundle layout that can be detected from roots like `skills/`, `commands/`, `agents/`, `hooks/`, `.mcp.json`, `.lsp.json`, `settings.json` | keep truthful bundle wording, but do not claim native plugin status |
| Does the current repo need `openclaw.plugin.json`? | No. That would switch the contract into native plugin territory. | stay on the bundle/skill path |

What Campus Copilot now ships for this path:

- repo-owned skill pack index:
  - [`../skills/catalog.json`](../skills/catalog.json)
- official skill entrypoints:
  - `skills/*/SKILL.md`
- repo-owned upstream packet:
  - [`../skills/clawhub-submission.packet.json`](../skills/clawhub-submission.packet.json)
- deterministic repo-side check:
  - `pnpm check:skill-catalog`

Truth boundary:

> The packet above is a **repo-owned submission packet**, not an upstream
> marketplace manifest. That distinction is intentional because the official
> docs did not publish a stable marketplace manifest schema for plain skill
> uploads in this wave.

Owner-only later:

1. choose which skills to publish first
2. run `clawhub skill publish <path> --slug ... --name ... --version ...`
3. provide changelog/tags at publish time

## Docker / Image Publication Prep

Official sources:

- [Dockerfile reference: `LABEL`](https://docs.docker.com/reference/dockerfile/)
- [Docker label guidance](https://docs.docker.com/config/labels-custom-metadata/)
- [Docker annotations](https://docs.docker.com/build/building/annotations/)
- [OCI annotation keys](https://raw.githubusercontent.com/opencontainers/image-spec/main/annotations.md)

What is worth locking down in the repo before any push:

| Priority | Field or rule | Why it belongs in the repo now |
| :-- | :-- | :-- |
| required | canonical local tag | keeps local docs and smoke commands deterministic |
| required | clear public image coordinate recommendation | prevents “we will publish somewhere later” vagueness |
| required | truth boundary (`apps/api` thin BFF, not MCP transport) | avoids overclaiming the container as the MCP path |
| strongly recommended | OCI labels for title, description, url, documentation, source, licenses, vendor | these are stable image metadata and can be inspected automatically |
| recommended | version/revision/build-date args | useful for public registry and provenance without changing runtime behavior |

Campus Copilot packet for this path:

- [`container-publication.packet.json`](container-publication.packet.json)
- deterministic repo-side check:
  - `pnpm check:container-surface`

Canonical image strategy:

- local image tag: `campus-copilot-api:local`
- canonical public image coordinate: `ghcr.io/xiaojiou176-open/campus-copilot-api`
- recommended public tags:
  - `0.1.0`
  - `0.1`
  - `latest`
- optional owner-chosen mirror:
  - `<owner-controlled-namespace>/campus-copilot-api`

Truth boundary:

> This container packages `apps/api`, the thin local HTTP BFF. It is **not**
> the `@campus-copilot/mcp-server` stdio transport.

Owner-only later:

1. build and smoke locally
2. create the target registry repository if needed
3. push the image and assign public visibility on the chosen registry

## Glama Directory Prep

Official sources:

- [Glama MCP directory](https://glama.ai/mcp/servers)
- [Glama MCP API landing page](https://glama.ai/mcp/api)
- [Glama blog: add your own server](https://glama.ai/blog/2025-09-10-glama-mcp-server-hosting)

Current official evidence recovered in this wave:

| What we can confirm | What we could **not** recover |
| :-- | :-- |
| Glama has an official MCP directory and an “Add Server” flow | a stable vendor `manifest.json` / `manifest.yaml` submission schema |
| Glama treats servers as Docker-backed in its own hosting flow | a public, versioned repo-side schema contract for third-party repo submissions |
| Glama exposes directory/API surfaces for published servers | a deterministic packet format we can safely generate inside this repo |

Repo-side action that is therefore legitimate:

- keep the MCP packet ready
- keep the container packet ready
- keep the scoreboard truthful
- do **not** invent Glama-specific manifests

Current truthful state:

> `Glama-specific manifest: not generated by design. Generic submission packet:
> ready.`
