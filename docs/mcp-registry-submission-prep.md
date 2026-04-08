# MCP Registry Submission Prep

This is the focused repo-side packet for the official MCP Registry lane.

Use it when the question becomes:

> Is the `@campus-copilot/mcp-server` package ready from the repository side, so the only work left is owner auth, package publication, and the final `mcp-publisher` submit step?

## Truth Boundary

- The MCP Registry hosts metadata, not the package artifact itself.
- That means a real npm publication still has to happen later under owner-controlled credentials.
- The repo-side goal in this file is narrower:
  - keep `package.json`, `server.json`, README, and example configs aligned
  - keep the monorepo subfolder truth explicit
  - keep the transport truth explicit: `stdio`
  - keep the boundary explicit: repo-ready does **not** mean officially listed

## Official Contract In Plain Language

You can think of this like a customs form for a package shipment.
The registry wants the label and the package metadata to agree before it accepts the parcel.

For the current official flow:

- `package.json` must contain `mcpName`
- `server.json.name` must match that `mcpName`
- the package must be published to npm before registry submit
- the install surface in `server.json.packages[*]` must match the real package name/version/transport
- monorepos should keep the nested package path explicit so reviewers do not have to guess where the canonical package lives

## Current Repo-Side SSOT

- canonical package:
  - `packages/mcp-server/package.json`
- canonical registry metadata:
  - `packages/mcp-server/server.json`
- repo-owned reusable packet:
  - `packages/mcp-server/registry-submission.packet.json`
- deterministic repo-side gate:
  - `pnpm check:mcp-registry-preflight`

## Current Package Shape

- package name: `@campus-copilot/mcp-server`
- registry name: `io.github.xiaojiou176-open/campus-copilot-mcp`
- version: `0.1.0`
- transport: `stdio`
- repository subfolder: `packages/mcp-server`

## Owner-Only Later Steps

1. publish the npm package under owner-controlled credentials
2. authenticate the publisher:

```bash
mcp-publisher login github
```

3. publish the registry metadata:

```bash
mcp-publisher publish
```

4. verify the live registry entry after it appears upstream

## Current Verdict

- **Repo-side state**: `mcp registry preflight ready`
- **Package truth**: `real package + real server.json + real stdio install path`
- **Owner-only later**: npm publish, registry auth, final metadata submit
