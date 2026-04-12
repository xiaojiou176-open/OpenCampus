# Wave 4-7 Omnibus Ledger

This file is the back-half truth ledger after Wave 2 + 3 landed.

Use it when you need one place to answer:

- what Wave 4 already finished in the public/product story
- what Wave 5 now means for the Campus ↔ Switchyard seam
- what Wave 6 already has as preview tooling versus what still remains owner-only
- what Wave 7 still owns versus what still requires owner action

## Product Identity

Campus Copilot remains a **local-first academic decision workspace**.

It still does **not** become:

- a generic chatbot shell
- a hosted autonomy platform
- a write-capable operator bot
- a write-capable MCP server

The two formal user surfaces already share one product truth:

- extension workbench
- standalone read-only web workbench

They share the same:

- schema
- storage/read-model truth
- export contract
- cited AI contract

## Wave 4 Completion Snapshot

| Area | Current state |
| :-- | :-- |
| Dual-surface product story | extension + standalone web now read as one product in the repo-local front door/docs story |
| AI after structure wording | preserved |
| Front door | English-first and student-first |
| Builder truthfulness | current toolbox is described as read-only, local-first, and repo-public rather than hosted |
| Overclaim guardrail | still explicit: no write automation, no hosted autonomy, no public write-capable MCP |

Wave 4 is therefore **repo-local complete** for implementation and product-story scope, with only the final convergence pass still pending.
That remaining work is not a missing Wave-4 implementation slice; it is the last wording and asset-ordering alignment pass needed to keep the front door from drifting back out of sync in later turns.

## Browser Control Plane Side-Lane Ledger

The browser diagnostics substrate is internal control-plane work, not a student-facing feature.

Current repo-local evidence surface:

- `pnpm probe:live`
- `pnpm diagnose:live`
- `pnpm support:bundle`
- `LIVE_CAPTURE_CONSOLE=1 pnpm probe:live`
- `LIVE_CAPTURE_NETWORK=1 pnpm probe:live`
- `LIVE_CAPTURE_TRACE=1 pnpm probe:live`

Current landing zones:

- [`scripts/live-site-probe.mjs`](../scripts/live-site-probe.mjs)
- [`scripts/live-preflight.mjs`](../scripts/live-preflight.mjs)
- [`scripts/support-bundle.mjs`](../scripts/support-bundle.mjs)
- [`scripts/live-probe-shared.mjs`](../scripts/live-probe-shared.mjs)

Current result:

- console summary is supported
- network summary is supported
- trace capture is supported when the current context allows tracing
- support bundle readable highlights surface evidence coverage
- the repo can still recover an explicit clone/profile lane when the shared `9333` port is contested by another repo's browser automation
- fresh repo-owned reprobe on **April 4, 2026 PDT** established two truths we should keep separate:
  - `127.0.0.1:9333` was later proven to be a contested listener owned by an unrelated Chrome for Testing flow, so it is no longer a clean Campus-only SSOT lane
  - same-turn direct page inspection and temporary clean-port experiments briefly surfaced stronger page-level evidence than the normal repo-owned probe
- current SSOT rule:
  - keep the stronger page-level observations as supporting evidence
  - do not silently promote them above the reproducible repo-owned probe lane until the clean listener continuity is stable enough to rerun on demand
- that means the remaining live/browser blockers are now best described as:
  - explicit clone listener continuity / local desktop runtime ownership
  - human approval somewhere along the UW-linked path once the clean lane is stable
  - not wrong-profile confusion or missing repo-owned credential plumbing

This lane remains:

- internal
- manual/live
- separate from the current formal student-facing scope

## Wave 5 Target State

Wave 5 is about **separation of responsibility**, not repo replacement.

Current split:

| Layer | Owned by Campus Copilot | Delegated to Switchyard |
| :-- | :-- | :-- |
| student-facing semantics | yes | no |
| `messages[]` / `structuredAnswer` / citations / trust gaps / next actions | yes | consumed through the same contract |
| workspace truth / stop-rule / decision surfaces | yes | no |
| provider/runtime transport | no | yes, through the local service boundary |

Current repo-local seam:

- `apps/api` exposes `/api/ai/ask` as the stable Campus consumer seam
- `apps/api` exposes `/api/providers/switchyard/chat`
- `packages/ai` supports `switchyard` on the same semantic request/response contract
- builder tools can select the `Switchyard` path without changing the student-facing explanation contract

What is **already true**:

- the consumer seam is first-class
- the semantic contract stays inside Campus Copilot
- provider/runtime transport already has a local Switchyard bridge

What is **not done yet**:

- `Switchyard-first` is not yet the sole, fully frozen runtime policy
- the Campus consumer seam still coexists with direct provider transport logic
- the repo has not yet fully rewritten its back-half docs around the higher Switchyard-first bar

## Public Builder Packaging Matrix

The repository already has a real read-only builder toolbox preview.

### Current repo-public packages

| Surface | Path | What it does |
| :-- | :-- | :-- |
| SDK | [`packages/sdk/src/index.ts`](../packages/sdk/src/index.ts) | exports read-only `api`, `snapshot`, and `sites` entrypoints |
| Workspace SDK | [`packages/workspace-sdk/src/index.ts`](../packages/workspace-sdk/src/index.ts) | derives read-model state, export artifacts, and AI-ready messages from imported snapshots |
| Site SDK | [`packages/site-sdk/src/index.ts`](../packages/site-sdk/src/index.ts) | read-only per-site overview helpers over the shared imported snapshot contract |
| Provider runtime | [`packages/provider-runtime/src/index.ts`](../packages/provider-runtime/src/index.ts) | keeps the Campus-to-provider seam stable while optional local Switchyard transport stays separate from Campus semantics |
| CLI | [`packages/cli/bin/campus-copilot.mjs`](../packages/cli/bin/campus-copilot.mjs) | `provider-status`, `ask`, `summary`, `site`, `snapshot site`, and `snapshot export` |
| MCP config | [`packages/mcp/src/index.mjs`](../packages/mcp/src/index.mjs) | repo-public config helpers for snapshot-backed site sidecars |
| MCP stdio server | [`packages/mcp-server/src/bin.ts`](../packages/mcp-server/src/bin.ts) | combined read-only stdio MCP server for health, provider status, ask, snapshot views, and export |
| Site MCP bins | [`packages/mcp-readonly/src/server.mjs`](../packages/mcp-readonly/src/server.mjs) | per-site read-only MCP servers for `Canvas` / `Gradescope` / `EdStem` / `MyUW` |

### SDK entrypoints

| Entry point | Path | Scope |
| :-- | :-- | :-- |
| `@campus-copilot/sdk/api` | [`packages/sdk/src/api.ts`](../packages/sdk/src/api.ts) | thin-BFF client for health, provider status, and chat |
| `@campus-copilot/sdk/snapshot` | [`packages/sdk/src/snapshot.ts`](../packages/sdk/src/snapshot.ts) | imported snapshot parsing and workspace summary |
| `@campus-copilot/sdk/sites` | [`packages/sdk/src/sites.ts`](../packages/sdk/src/sites.ts) | read-only per-site selectors |
| `@campus-copilot/workspace-sdk` | [`packages/workspace-sdk/src/index.ts`](../packages/workspace-sdk/src/index.ts) | shared read-model derivation, export artifacts, and AI-context building |
| `@campus-copilot/site-sdk` | [`packages/site-sdk/src/index.ts`](../packages/site-sdk/src/index.ts) | site overview helpers over the same snapshot contract |

### MCP tools

| Tool | Scope |
| :-- | :-- |
| `campus_health` | thin-BFF health check |
| `providers_status` | thin-BFF provider readiness plus Switchyard-first priority order |
| `ask_campus_copilot` | read-only BFF chat over the Campus semantic contract |
| `canvas_snapshot_view` | read-only Canvas slice from an imported snapshot |
| `gradescope_snapshot_view` | read-only Gradescope slice from an imported snapshot |
| `edstem_snapshot_view` | read-only EdStem slice from an imported snapshot |
| `myuw_snapshot_view` | read-only MyUW slice from an imported snapshot |
| `export_snapshot_artifact` | read-only export artifact generation from an imported snapshot |

### Public skills and integration examples

| Surface | Path |
| :-- | :-- |
| Public read-only skill | [`skills/read-only-workspace-audit/SKILL.md`](../skills/read-only-workspace-audit/SKILL.md) |
| Codex MCP example | [`examples/codex/campus-copilot-mcp.json`](../examples/codex/campus-copilot-mcp.json) |
| Claude/Codex integration examples | [`examples/integrations`](../examples/integrations) |

### What still is not claimed

- hosted SaaS API
- generated clients
- write-capable MCP
- live browser/session control as a public builder surface
- public plugin marketplace packaging

## Wave 6 Current Preview Baseline

| Item | Current state |
| :-- | :-- |
| read-only SDK | real preview surface exists and fresh package tests passed |
| read-only CLI | real preview surface exists and fresh package tests passed |
| read-only MCP | real preview surface exists and fresh package tests passed |
| provider-runtime seam package | real preview surface exists and fresh package tests passed |
| four site MCP tools | real preview surface exists |
| public skills example | repo-tracked |
| hosted/public package publishing | still owner-only / not implied |
| write-capable MCP/plugin/autonomy | still no-go |

Wave 6 is therefore **repo-local truthful preview complete**, not registry-published.

The remaining work is no longer “invent the toolbox.” It is:

- keep package names, command names, and example configs from drifting back out of sync
- keep preview wording truthful across README/docs/examples
- leave registry publishing, release-channel policy, and broader package distribution as owner-only decisions

## Newest Planner SSOT vs Older Wording

| Topic | Earlier wording | Newer SSOT | Current repo truth after this writeback |
| :-- | :-- | :-- | :-- |
| Wave 4 | surface polish and i18n only | surface convergence + SSOT writeback so extension and web clearly read as one product | current repo already has shared truth, and the only remaining Wave 4 work is the final convergence pass that keeps wording and assets aligned |
| Wave 5 | internal private clients only | internal substrate extraction + browser control-plane side-lane + `Switchyard-first` compat/cutover | current repo already has a seam, but the full cutover contract is still pending |
| Wave 6 | evaluate future public packaging | must deliver truthful read-only builder toolbox | repo-public preview exists, but final public-safe packaging is still pending |
| Wave 7 | launch later | still last, but must fully align front door, assets, examples, and public-safe wording with shipped truth | partially complete repo-locally; off-repo publishing remains owner-only |
| Browser control plane | mostly treated as live caveat | explicit internal diagnostics substrate side-lane | upgraded in this ledger, still not a student-facing feature |
| Campus vs Switchyard | optional local bridge wording | Campus keeps student semantics; Switchyard owns transport/runtime substrate | current docs now reflect the direction, but the final cutover is still ahead |

## Launch Surface Matrix

| Surface | Current state |
| :-- | :-- |
| README hero and front door | updated |
| docs hub | updated |
| hero/social/workbench assets | repo-tracked |
| Codex integration example | repo-tracked |
| public examples | repo-tracked and local-first |
| SEO beyond GitHub/repo discoverability | still later |
| video | still later |

## Wave 7 Current Baseline

Wave 7 is only **partially** complete repo-locally.

What is already repo-local:

- truthful front door
- docs hub alignment
- builder-toolbox example config
- asset inventory kept in repo
- release draft/runbook skeletons

What still remains later or owner-only:

- GitHub description/topics/social-preview re-check when release timing changes
- release page execution
- recorded video
- off-repo SEO and launch distribution

## Remaining Repo-Local Work By Wave

| Wave | Repo-local work still remaining |
| :-- | :-- |
| Wave 4 | final dual-surface convergence pass, IA/copy polishing, and any remaining product-surface drift cleanup |
| Wave 5 | formalize the `Switchyard-first` cutover contract without giving away Campus-owned semantics; continue browser diagnostics substrate hardening as an internal side-lane |
| Wave 6 | finish truthful preview-to-public packaging cleanup for SDK / CLI / MCP / skills / site API preview libs / site-scoped MCPs |
| Wave 7 | keep release docs, release notes, examples, and public-facing assets aligned so only owner publishing actions remain |

## Owner-Only Remaining Actions Ledger

| Action | Why it is owner-only | Where it happens | What still needs re-check afterward |
| :-- | :-- | :-- | :-- |
| Record and publish launch/demo video | needs human narration/screen capture/editorial judgment | off-repo media workflow | re-check that the video still matches current repo truth |
| Decide whether to publish workspace packages externally | requires publishing identity, versioning, and release policy decisions | package registry / release workflow | re-check package names, versioning, and docs claims before release |
| Approve optional extra live proof if a later release wants stronger than existing-tab evidence | stronger attach confirmation may still require owner-held browser/session continuity | live browser/session workflow | re-check that any extra live proof still matches the current read-only boundary |

## GitHub Surface Snapshot

Fresh checked on `2026-04-03`:

- repository description is already set and aligned with the current front door
- homepage remains intentionally blank
- topics are already configured, including `ai` and `decision-support`
- custom social preview is already enabled
- discussions are already enabled
- auto-merge is disabled, so future PRs may still require manual/admin merge even after checks pass
