# MCP Registry Submission Prep

This is the focused repo-side packet for the official MCP Registry lane.

Use it when the question becomes:

> Is the `@campus-copilot/mcp-server` package ready from the repository side, so the only work left is owner auth, package publication, and the final `mcp-publisher` submit step?

## Truth Boundary

- the MCP Registry hosts metadata, not the package artifact itself
- that means a real npm publication still has to happen later under owner-controlled credentials
- the repo-side goal here is narrower:
  - keep `package.json`, `server.json`, README, and example configs aligned
  - keep the monorepo subfolder truth explicit
  - keep the transport truth explicit: `stdio`
  - keep the boundary explicit: repo-ready does **not** mean officially listed

## Current Repo-Side SSOT

| Surface | Current repo-owned source | Validation |
| :-- | :-- | :-- |
| canonical package | `packages/mcp-server/package.json` | `pnpm check:mcp-registry-preflight` |
| canonical registry metadata | `packages/mcp-server/server.json` | `pnpm check:mcp-registry-preflight` |
| reusable packet | `packages/mcp-server/registry-submission.packet.json` | `pnpm check:mcp-registry-preflight` |

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
