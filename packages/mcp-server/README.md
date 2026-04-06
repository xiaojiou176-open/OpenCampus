# @campus-copilot/mcp-server

Read-only MCP server for the local Campus Copilot BFF and imported workspace snapshots.

This is the generic MCP entry point used by the integration examples under `examples/integrations/`.

Use this package when you want the smallest single-server entry point for Codex / Claude Code-style local MCP workflows.

If you are still choosing between the generic MCP server, site sidecars, CLI, or SDK surfaces, start with [`../../examples/toolbox-chooser.md`](../../examples/toolbox-chooser.md) first.

## Install

Current install status: repo-local public-ready candidate with a bundled JS server artifact. Do not assume hosted MCP distribution or official registry listing from this README alone.

From the repo root:

```bash
pnpm install
pnpm --filter @campus-copilot/mcp-server build
pnpm start:mcp
```

Shared public-preview proof loop from the repo root:

```bash
pnpm proof:public
```

First command to try:

```bash
pnpm --filter @campus-copilot/mcp-server start
```

Registry-unblock progress in this repo:

- the published bin now targets a bundled `dist/bin.mjs` artifact instead of a raw TypeScript entrypoint
- this package is the cleanest current candidate for future official MCP Registry submission work
- preregistry metadata now lives beside the package in [`server.json`](./server.json) and the package-level `mcpName`
- official listing is still a separate upstream step; this README does not imply it has already happened

## Current tools

- `campus_health`
- `providers_status`
- `ask_campus_copilot`
- `canvas_snapshot_view`
- `gradescope_snapshot_view`
- `edstem_snapshot_view`
- `myuw_snapshot_view`
- `export_snapshot_artifact`

## Boundary

- local-first
- read-only
- snapshot-first or thin-BFF-first
- not a hosted MCP service
- not a live-browser control plane

## See also

- [`../../examples/toolbox-chooser.md`](../../examples/toolbox-chooser.md)
- [`../../examples/integrations/README.md`](../../examples/integrations/README.md)
- [`../../examples/integrations/codex-mcp.example.json`](../../examples/integrations/codex-mcp.example.json)
- [`../../examples/integrations/codex-mcp-shell.example.json`](../../examples/integrations/codex-mcp-shell.example.json)
- [`../../examples/integrations/claude-code-mcp.example.json`](../../examples/integrations/claude-code-mcp.example.json)
- [`../../examples/integrations/claude-code-mcp-shell.example.json`](../../examples/integrations/claude-code-mcp-shell.example.json)
- [`../../examples/openclaw-readonly.md`](../../examples/openclaw-readonly.md)
