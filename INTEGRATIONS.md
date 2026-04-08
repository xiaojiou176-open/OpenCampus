# Integrations

Campus Copilot already exposes several **truthful local-first integration paths**.

Use this page when the question is:

> “How do I connect this repo to Codex, Claude, OpenClaw, MCP, or other local builder workflows without overclaiming hosted/plugin status?”

## Start Here

| Need | Best first stop |
| :-- | :-- |
| Codex / Claude / Claude Desktop MCP config | [`examples/integrations/README.md`](examples/integrations/README.md) |
| Plugin-grade bundle overview | [`examples/integrations/plugin-bundles.md`](examples/integrations/plugin-bundles.md) |
| Read-only public skills | [`skills/README.md`](skills/README.md), [`skills/catalog.json`](skills/catalog.json), [`skills/clawhub-submission.packet.json`](skills/clawhub-submission.packet.json), and [`docs/skill-publication-prep.md`](docs/skill-publication-prep.md) |
| OpenClaw-style local runtime route | [`examples/openclaw-readonly.md`](examples/openclaw-readonly.md) |
| Local containerized HTTP edge | [`DISTRIBUTION.md`](DISTRIBUTION.md) |
| Browser extension store last mile | [`docs/chrome-web-store-submission-packet.md`](docs/chrome-web-store-submission-packet.md) |
| Package/public publication truth | [`docs/14-public-distribution-scoreboard.md`](docs/14-public-distribution-scoreboard.md) |

## Truthful Claims Only

Current integration surfaces are:

- local-first
- read-only
- repo-public preview or plugin-grade repo bundles

They are **not** currently:

- official marketplace listings
- hosted plugin platforms
- write-capable browser-control plugins
- multi-tenant hosted runtimes

## Short Routing

- **Codex**: start with [`examples/integrations/codex-mcp.example.json`](examples/integrations/codex-mcp.example.json)
- **Claude Code / Claude Desktop**: start with [`examples/integrations/claude-code-mcp.example.json`](examples/integrations/claude-code-mcp.example.json)
- **OpenClaw-style local runtimes**: start with [`examples/openclaw-readonly.md`](examples/openclaw-readonly.md)
- **Need the repo-owned skill pack index first?** start with [`skills/catalog.json`](skills/catalog.json)
- **Need the generic upstream packet for later ClawHub-style submission?** start with [`skills/clawhub-submission.packet.json`](skills/clawhub-submission.packet.json) and [`docs/16-distribution-preflight-packets.md`](docs/16-distribution-preflight-packets.md)
- **Need the local containerized HTTP edge first?** start with [`DISTRIBUTION.md`](DISTRIBUTION.md)
- **Need the narrowest builder proof first?** start with [`examples/README.md`](examples/README.md)

## Boundary Reminder

Campus Copilot stays:

- a local-first academic decision workspace
- a read-only context provider
- a repo-public bundle/router for integrations
- a source-first monorepo whose root package is not itself the publish artifact

It does **not** become a generic AI shell, hosted autonomy layer, or official plugin listing just because these integration routes exist.
