# Distribution Preflight Packets

This file is the repo-side packet inventory for publication-facing surfaces.

Use it when the question is:

> Which exact packet file is ready, which check proves it, and where does owner-only action begin?

This file does **not** claim that any submission has already happened.

## Packet Inventory

| Surface | Repo-owned packet or source | Validation command | Current truthful state | Read next |
| :-- | :-- | :-- | :-- | :-- |
| MCP Registry | [`../packages/mcp-server/registry-submission.packet.json`](../packages/mcp-server/registry-submission.packet.json) | `pnpm check:mcp-registry-preflight` | `registry-ready (repo-local)` | [`mcp-registry-submission-prep.md`](mcp-registry-submission-prep.md) |
| OpenClaw / ClawHub skill publish | [`../skills/clawhub-submission.packet.json`](../skills/clawhub-submission.packet.json) | `pnpm check:skill-catalog` | `generic upstream packet ready` | [`skill-publication-prep.md`](skill-publication-prep.md) |
| Thin BFF container image | [`container-publication.packet.json`](container-publication.packet.json) | `pnpm check:container-surface` | `container-publication-prepared` for `campus-copilot-api:local` and future `ghcr.io/xiaojiou176-open/campus-copilot-api` | [`container-publication-prep.md`](container-publication-prep.md) |
| Chrome Web Store | extension build output plus [`chrome-web-store-submission-packet.md`](chrome-web-store-submission-packet.md) | `pnpm --filter @campus-copilot/extension build` | `packet-ready` | [`chrome-web-store-submission-packet.md`](chrome-web-store-submission-packet.md) |
| Glama / generic directory reuse | reuse the MCP packet, container packet, and scoreboard | cross-check against [`14-public-distribution-scoreboard.md`](14-public-distribution-scoreboard.md) | `generic submission packet ready` | [`15-publication-submission-packet.md`](15-publication-submission-packet.md) |

## What Each Packet Is For

| Packet lane | What it is for | What it is not |
| :-- | :-- | :-- |
| MCP Registry | align package metadata, `server.json`, and stdio install truth | proof that the package is already published or listed |
| Skill publish | give owner-side publish commands and stable metadata inputs | an invented vendor manifest |
| Container image | lock image naming, OCI metadata, and truth boundary | proof that GHCR or Docker Hub already has a live page |
| Chrome Web Store | prove the repo already has build, assets, and a submission packet | proof that the extension is already store-listed |
| Generic directory reuse | keep generic inputs ready for later directories like Glama | permission to invent a platform-specific manifest without a stable schema |

## Owner-Only Later Boundary

Every packet in this file still needs one of the following before it becomes public:

- package publication
- registry submission
- directory submission
- store dashboard upload
- registry push under owner credentials

For the MCP Registry lane, the owner-only submit flow is still:

```bash
mcp-publisher login github
mcp-publisher publish
```

That is why these packets should be read together with:

1. [`14-public-distribution-scoreboard.md`](14-public-distribution-scoreboard.md)
2. [`15-publication-submission-packet.md`](15-publication-submission-packet.md)

## Guardrails

- Keep Glama on the generic-packet path until a stable vendor schema is recovered.
- Do not invent `manifest.yaml`, `openclaw.plugin.json`, or a fake store manifest just to make the packet table look fuller.
- Do not promote any packet here to `officially listed` without upstream read-back proof.
