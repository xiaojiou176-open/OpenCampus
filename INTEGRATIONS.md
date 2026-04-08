# Integrations

Use this page when the question is:

> How do I plug Campus Copilot into local builder workflows without overclaiming hosted or marketplace status?

## Start Here

| Need | Best first stop |
| :-- | :-- |
| Codex / Claude / Claude Desktop MCP config | [`examples/integrations/README.md`](examples/integrations/README.md) |
| Plugin-grade bundle overview | [`examples/integrations/plugin-bundles.md`](examples/integrations/plugin-bundles.md) |
| Public skills | [`skills/README.md`](skills/README.md), [`skills/catalog.json`](skills/catalog.json), [`docs/skill-publication-prep.md`](docs/skill-publication-prep.md) |
| OpenClaw-style local runtime route | [`examples/openclaw-readonly.md`](examples/openclaw-readonly.md) |
| Local containerized HTTP edge | [`DISTRIBUTION.md`](DISTRIBUTION.md) |
| Browser-extension store last mile | [`docs/chrome-web-store-submission-packet.md`](docs/chrome-web-store-submission-packet.md) |
| Package/public publication truth | [`docs/14-public-distribution-scoreboard.md`](docs/14-public-distribution-scoreboard.md) |

## Current Truth

- all current integration surfaces are **local-first**
- all current public builder paths are **read-only**
- current bundle wording is **repo bundle / repo router / repo packet**

They are **not**:

- official marketplace listings
- hosted multi-tenant runtimes
- write-capable browser automation plugins

## Short Routing

- **Codex**: [`examples/integrations/codex-mcp.example.json`](examples/integrations/codex-mcp.example.json)
- **Claude Code / Desktop**: [`examples/integrations/claude-code-mcp.example.json`](examples/integrations/claude-code-mcp.example.json)
- **OpenClaw**: [`examples/openclaw-readonly.md`](examples/openclaw-readonly.md)
- **Skills**: [`skills/catalog.json`](skills/catalog.json)
- **Skill publication packet**: [`skills/clawhub-submission.packet.json`](skills/clawhub-submission.packet.json)
- **Container lane**: [`DISTRIBUTION.md`](DISTRIBUTION.md)

## Boundary Reminder

Campus Copilot stays:

- a local-first academic decision workspace
- a read-only context provider
- a repo-public bundle/router for integrations

It does **not** become a hosted plugin platform just because these routes exist.
