# Skill Publication Prep

This file is the repo-side packet for public skill publication and directory preparation.

Use it when the question becomes:

> Which skill-facing facts are already packaged inside this repo, and which parts still require owner login, owner clicks, or a platform-specific upload later?

## Truth Boundary

- `skills/catalog.json` is the current repo-owned machine-readable index.
- It is **not** a fake upstream marketplace manifest.
- The current OpenClaw-compatible bundle route can stay on a **manifestless Claude-style bundle layout**.
- The current ClawHub skill publication path is **CLI-flag driven**.
- The current Glama-specific visible claim path is domain-based `/.well-known/glama.json` for remote connectors, which does **not** match this repo's local stdio MCP and thin-BFF surfaces today.

That is why this repo now ships a **publication packet plus deterministic checks**, not an invented `manifest.yaml`, `openclaw.plugin.json`, or Glama-specific local manifest.

## Official Contract In Plain Language

You can think of this like preparing name tags for a conference.
The official venue already tells you what format the badges use.
Your job is to prepare the attendee list in that format, not invent a different badge template.

For the current official surfaces:

- OpenClaw bundles can use the compatible Claude-style bundle layout without forcing a vendor manifest.
- ClawHub skill publish works from a skill folder plus CLI arguments such as `--slug`, `--name`, `--version`, and `--tags`.
- Glama's visible connector-claim flow is tied to a remote server domain, not to a local-only stdio package bundle.

## Current Repo-Side SSOT

- `skills/catalog.json` keeps the pack version and skill roster aligned
- `skills/*/SKILL.md` keeps each skill's actual entrypoint and description aligned
- `skills/README.md` explains the read-only bundle boundaries
- `pnpm check:skill-catalog` validates the repo-owned catalog
- `pnpm check:skill-publication-surface` validates this packet and the surrounding routing docs

## Publication Packet

Recommended shared version for the current public pack: `0.1.0`

Recommended shared baseline tags for ClawHub skill publish: `latest,campus-copilot,read-only`

| Skill id | Skill path | Recommended display name | ClawHub-ready command template |
| :-- | :-- | :-- | :-- |
| `read-only-workspace-analysis` | `skills/read-only-workspace-analysis/SKILL.md` | `Read-Only Workspace Analysis` | `clawhub skill publish ./skills/read-only-workspace-analysis --slug read-only-workspace-analysis --name "Read-Only Workspace Analysis" --version 0.1.0 --tags latest,campus-copilot,read-only` |
| `read-only-workspace-audit` | `skills/read-only-workspace-audit/SKILL.md` | `Read-Only Workspace Audit` | `clawhub skill publish ./skills/read-only-workspace-audit --slug read-only-workspace-audit --name "Read-Only Workspace Audit" --version 0.1.0 --tags latest,campus-copilot,read-only` |
| `current-view-triage` | `skills/current-view-triage/SKILL.md` | `Current View Triage` | `clawhub skill publish ./skills/current-view-triage --slug current-view-triage --name "Current View Triage" --version 0.1.0 --tags latest,campus-copilot,read-only` |
| `openclaw-readonly-consumer` | `skills/openclaw-readonly-consumer/SKILL.md` | `OpenClaw Read-Only Consumer` | `clawhub skill publish ./skills/openclaw-readonly-consumer --slug openclaw-readonly-consumer --name "OpenClaw Read-Only Consumer" --version 0.1.0 --tags latest,campus-copilot,read-only` |
| `site-mcp-consumer` | `skills/site-mcp-consumer/SKILL.md` | `Site MCP Consumer` | `clawhub skill publish ./skills/site-mcp-consumer --slug site-mcp-consumer --name "Site MCP Consumer" --version 0.1.0 --tags latest,campus-copilot,read-only` |
| `site-overview-audit` | `skills/site-overview-audit/SKILL.md` | `Site Overview Audit` | `clawhub skill publish ./skills/site-overview-audit --slug site-overview-audit --name "Site Overview Audit" --version 0.1.0 --tags latest,campus-copilot,read-only` |
| `site-snapshot-review` | `skills/site-snapshot-review/SKILL.md` | `Site Snapshot Review` | `clawhub skill publish ./skills/site-snapshot-review --slug site-snapshot-review --name "Site Snapshot Review" --version 0.1.0 --tags latest,campus-copilot,read-only` |
| `switchyard-runtime-check` | `skills/switchyard-runtime-check/SKILL.md` | `Switchyard Runtime Check` | `clawhub skill publish ./skills/switchyard-runtime-check --slug switchyard-runtime-check --name "Switchyard Runtime Check" --version 0.1.0 --tags latest,campus-copilot,read-only` |

## OpenClaw Bundle Note

The current repo does **not** ship `openclaw.plugin.json`.
That is intentional for this wave.

The current repo-side claim is narrower and more honest:

- the repo already exposes a read-only `skills/` root
- the current bundle story stays on the manifestless Claude-style bundle layout
- the current packet is enough for owner-side ClawHub skill publication later without inventing a vendor-only manifest that official docs do not require here

## Glama Note

Current Glama-facing truth is also intentionally narrow:

- the official visible connector claim path is `/.well-known/glama.json`
- that flow assumes a remote server domain
- this repo's canonical public surfaces are a local `stdio` MCP server plus a local thin HTTP BFF

So the correct repo-side action in this wave is:

- keep a generic directory packet ready in `docs/15-publication-submission-packet.md`
- do **not** invent a Glama-specific manifest for the local-only surfaces

## Owner-Only Later Steps

1. choose whether to publish the skills one by one with `clawhub skill publish` or scan them from a working directory with `clawhub sync --all`
2. authenticate with the real ClawHub account and complete the publish step later
3. if a future remote MCP server is deployed and Glama becomes relevant, publish the real `/.well-known/glama.json` file on that remote domain and claim the connector there

## Current Verdict

- **Repo-side state**: `skill publication packet ready`
- **OpenClaw bundle truth**: `compatible repo bundle on a manifestless Claude-style layout`
- **ClawHub truth**: `publish commands ready, not yet published`
- **Glama truth**: `generic directory packet ready; no stable local-surface manifest path recovered`
