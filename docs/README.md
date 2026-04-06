# Documentation Index

This file is the canonical docs router.

Use it like a building directory:

- `README.md` is the public landing page
- `CONTRIBUTING.md` is the contributor entry point
- the numbered docs below are concise canonical briefs
- `09-implementation-decisions.md` records current locked choices
- `11-wave1-contract-freeze-gap-matrix.md` records the frozen current-vs-next-vs-later contract
- `12-wave4-7-omnibus-ledger.md` records the post-Wave23 back-half truth for Wave 4-7
- `13-site-depth-exhaustive-ledger.md` records the exhaustive site-depth map and hard classifications
- `14-public-distribution-scoreboard.md` records the current public distribution ledger and exact registry/plugin blockers
- `15-publication-submission-packet.md` turns the current candidate set into an owner-ready publish/submission order
- `launch-packet.md` is the shortest launch/closeout packet for reviewers who need the proof assets, release notes, release runbook, and GitHub settings checklist in one place
- `verification-matrix.md` records required vs optional vs manual validation lanes
- `live-validation-runbook.md` records manual live procedure only
- the current public story is **decision workspace first, AI/runtime second**

## Canonical Reading Order

If you are a maintainer or contributor, read in this order:

1. [`../README.md`](../README.md)
2. [`../CONTRIBUTING.md`](../CONTRIBUTING.md)
3. [`../CLAUDE.md`](../CLAUDE.md) for the public AI collaborator contract
4. [`09-implementation-decisions.md`](09-implementation-decisions.md)
5. [`11-wave1-contract-freeze-gap-matrix.md`](11-wave1-contract-freeze-gap-matrix.md)
6. [`12-wave4-7-omnibus-ledger.md`](12-wave4-7-omnibus-ledger.md)
7. [`13-site-depth-exhaustive-ledger.md`](13-site-depth-exhaustive-ledger.md)
8. [`verification-matrix.md`](verification-matrix.md)
9. [`integration-boundaries.md`](integration-boundaries.md)
10. [`diagnostics-and-logging.md`](diagnostics-and-logging.md)
11. [`disk-governance.md`](disk-governance.md)
12. The relevant numbered brief below for the subsystem you are changing

## Start Here By Intent

If you are trying to understand the repository quickly, use the path that matches your intent instead of reading the docs like a phone book:

- **I want the student-facing product shape first**: start with [`../README.md`](../README.md), then [`01-product-prd.md`](01-product-prd.md), then [`06-export-and-user-surfaces.md`](06-export-and-user-surfaces.md)
- **I want the builder/API surface**: start with [`10-builder-api-and-ecosystem-fit.md`](10-builder-api-and-ecosystem-fit.md), then [`api/openapi.yaml`](api/openapi.yaml), then [`05-ai-provider-and-runtime.md`](05-ai-provider-and-runtime.md)
- **I want builder-facing examples and public skills**: start with [`../examples/README.md`](../examples/README.md), then [`../skills/README.md`](../skills/README.md), then [`10-builder-api-and-ecosystem-fit.md`](10-builder-api-and-ecosystem-fit.md)
- **I want the exact public distribution blockers**: start with [`14-public-distribution-scoreboard.md`](14-public-distribution-scoreboard.md), then [`../examples/integrations/plugin-bundles.md`](../examples/integrations/plugin-bundles.md), then [`../examples/README.md`](../examples/README.md)
- **I want the exact publish order after the blockers**: start with [`15-publication-submission-packet.md`](15-publication-submission-packet.md), then [`14-public-distribution-scoreboard.md`](14-public-distribution-scoreboard.md)
- **I want the fastest package/toolbox chooser**: start with [`../examples/toolbox-chooser.md`](../examples/toolbox-chooser.md), then the matching package README under `../packages/`
- **I want Codex / Claude Code / OpenClaw / MCP onboarding**: start with [`../README.md`](../README.md), then [`../examples/README.md`](../examples/README.md), then [`../skills/README.md`](../skills/README.md), then [`10-builder-api-and-ecosystem-fit.md`](10-builder-api-and-ecosystem-fit.md)
- **I want the shortest builder proof path**: start with [`../examples/README.md`](../examples/README.md), then [`../examples/toolbox-chooser.md`](../examples/toolbox-chooser.md), then [`../examples/integrations/README.md`](../examples/integrations/README.md), then [`../skills/README.md`](../skills/README.md), then [`../examples/current-view-triage-example.md`](../examples/current-view-triage-example.md), then [`../examples/site-overview-audit-example.md`](../examples/site-overview-audit-example.md), then [`10-builder-api-and-ecosystem-fit.md`](10-builder-api-and-ecosystem-fit.md)
- **I want the Wave 4-7 back-half truth**: start with [`12-wave4-7-omnibus-ledger.md`](12-wave4-7-omnibus-ledger.md), then [`10-builder-api-and-ecosystem-fit.md`](10-builder-api-and-ecosystem-fit.md), then [`05-ai-provider-and-runtime.md`](05-ai-provider-and-runtime.md)
- **I want the current formal scope vs next-phase split**: start with [`11-wave1-contract-freeze-gap-matrix.md`](11-wave1-contract-freeze-gap-matrix.md), then [`13-site-depth-exhaustive-ledger.md`](13-site-depth-exhaustive-ledger.md), then [`08-phase-plan-and-repo-writing-brief.md`](08-phase-plan-and-repo-writing-brief.md)
- **I want the full four-site depth ledger**: start with [`13-site-depth-exhaustive-ledger.md`](13-site-depth-exhaustive-ledger.md), then [`site-capability-matrix.md`](site-capability-matrix.md), then [`04-adapter-spec.md`](04-adapter-spec.md)
- **I want the live/verification truth**: start with [`verification-matrix.md`](verification-matrix.md), then [`live-validation-runbook.md`](live-validation-runbook.md), then [`site-capability-matrix.md`](site-capability-matrix.md)
- **I want to continue a remaining selective gap with proof first**: start with [`13-site-depth-exhaustive-ledger.md`](13-site-depth-exhaustive-ledger.md), then [`live-validation-runbook.md`](live-validation-runbook.md), then [`verification-matrix.md`](verification-matrix.md)
- **I want the launch/closeout packet**: start with [`launch-packet.md`](launch-packet.md), then [`release-notes-wave47-draft.md`](release-notes-wave47-draft.md), then [`release-runbook.md`](release-runbook.md)
- **I want the core runtime chain**: start with [`02-system-architecture.md`](02-system-architecture.md), [`03-domain-schema.md`](03-domain-schema.md), and [`04-adapter-spec.md`](04-adapter-spec.md)

## Numbered Briefs

| File | Role | Current use |
| :-- | :-- | :-- |
| [`01-product-prd.md`](01-product-prd.md) | product boundary brief | what the repo is and is not |
| [`02-system-architecture.md`](02-system-architecture.md) | architecture brief | runtime chain and truth layers |
| [`03-domain-schema.md`](03-domain-schema.md) | schema brief | canonical entities and modeling rules |
| [`04-adapter-spec.md`](04-adapter-spec.md) | adapter brief | site collection contract and fallback order |
| [`05-ai-provider-and-runtime.md`](05-ai-provider-and-runtime.md) | AI/runtime brief | thin BFF and AI-after-structure rules |
| [`06-export-and-user-surfaces.md`](06-export-and-user-surfaces.md) | UX/export brief | sidepanel/popup/options/export surfaces |
| [`07-security-privacy-compliance.md`](07-security-privacy-compliance.md) | boundary brief | permissions, privacy, upload limits |
| [`08-phase-plan-and-repo-writing-brief.md`](08-phase-plan-and-repo-writing-brief.md) | execution-order brief | how to extend the repo without breaking its ordering |
| [`09-implementation-decisions.md`](09-implementation-decisions.md) | locked choices | current formal implementation choices |
| [`10-builder-api-and-ecosystem-fit.md`](10-builder-api-and-ecosystem-fit.md) | builder-fit brief | current API surface, ecosystem fit, and future MCP/API substrate direction |
| [`11-wave1-contract-freeze-gap-matrix.md`](11-wave1-contract-freeze-gap-matrix.md) | contract-freeze brief | current formal scope vs next-phase vs later |
| [`12-wave4-7-omnibus-ledger.md`](12-wave4-7-omnibus-ledger.md) | omnibus ledger | Wave 4-7 product, browser side-lane, Switchyard seam, builder packaging, and launch truth |
| [`13-site-depth-exhaustive-ledger.md`](13-site-depth-exhaustive-ledger.md) | site-depth ledger | exhaustive per-site resource map, classifications, and next-action framing |
| [`14-public-distribution-scoreboard.md`](14-public-distribution-scoreboard.md) | distribution ledger | bundle-grade, repo-public, and registry-blocked truth for current builder surfaces |
| [`15-publication-submission-packet.md`](15-publication-submission-packet.md) | submission packet | exact publish order, official URLs, and owner-only next actions for current candidates |

## Supporting Governance Docs

| Need | Canonical file |
| :-- | :-- |
| Public AI collaborator contract | [`../CLAUDE.md`](../CLAUDE.md) |
| AI/runtime boundary and builder-facing path | [`05-ai-provider-and-runtime.md`](05-ai-provider-and-runtime.md) |
| Machine-readable current HTTP contract | [`api/openapi.yaml`](api/openapi.yaml) |
| Builder example router | [`../examples/README.md`](../examples/README.md) |
| Plugin-grade bundle router | [`../examples/integrations/plugin-bundles.md`](../examples/integrations/plugin-bundles.md) |
| Fast package/toolbox chooser | [`../examples/toolbox-chooser.md`](../examples/toolbox-chooser.md) |
| Public skills router | [`../skills/README.md`](../skills/README.md) |
| Deterministic vs manual validation | [`verification-matrix.md`](verification-matrix.md) |
| Optional local coverage audit and test-pyramid context | [`verification-matrix.md`](verification-matrix.md) |
| Manual live procedure | [`live-validation-runbook.md`](live-validation-runbook.md) |
| Launch/closeout packet | [`launch-packet.md`](launch-packet.md) |
| Per-site capability snapshot | [`site-capability-matrix.md`](site-capability-matrix.md) |
| Exhaustive per-site depth and classification ledger | [`13-site-depth-exhaustive-ledger.md`](13-site-depth-exhaustive-ledger.md) |
| External boundary classes | [`integration-boundaries.md`](integration-boundaries.md) |
| Diagnostics contract and output rules | [`diagnostics-and-logging.md`](diagnostics-and-logging.md) |
| Disk footprint governance and cleanup lanes | [`disk-governance.md`](disk-governance.md) |
| GitHub settings-only checklist | [`github-surface-checklist.md`](github-surface-checklist.md) |
| Public asset inventory | [`storefront-assets.md`](storefront-assets.md) |
| Release execution checklist | [`release-runbook.md`](release-runbook.md) |
| Release notes draft | [`release-notes-wave47-draft.md`](release-notes-wave47-draft.md) |
| Frozen current-vs-next-vs-later contract | [`11-wave1-contract-freeze-gap-matrix.md`](11-wave1-contract-freeze-gap-matrix.md) |

## Rules

- One technical fact must be fully maintained in one canonical place.
- The numbered briefs are intentionally short. They are canonical summaries, not long historical essays.
- Do not create parallel `*-en.md` or `README` clones under `docs/`.
- If a fact belongs to runtime verification, move it to [`verification-matrix.md`](verification-matrix.md) or [`live-validation-runbook.md`](live-validation-runbook.md), not back into the numbered briefs.
- If a fact belongs to AI/agent/MCP fit, put it in a short canonical brief instead of scattering marketing copy across unrelated docs.
- If a fact belongs to the now-vs-next-vs-later boundary, put it in [`11-wave1-contract-freeze-gap-matrix.md`](11-wave1-contract-freeze-gap-matrix.md).
- If a fact belongs to longer per-site depth classification, keep it in [`13-site-depth-exhaustive-ledger.md`](13-site-depth-exhaustive-ledger.md) and only keep the short current snapshot in [`site-capability-matrix.md`](site-capability-matrix.md).
- If a fact belongs to the standalone Web workbench's import-based second-surface contract, keep it aligned with [`06-export-and-user-surfaces.md`](06-export-and-user-surfaces.md) and [`11-wave1-contract-freeze-gap-matrix.md`](11-wave1-contract-freeze-gap-matrix.md).
