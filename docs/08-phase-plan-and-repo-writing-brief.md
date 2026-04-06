# Execution-Order Brief

This file no longer acts as a long-form “how to start from an empty repo” essay.

Its canonical role is to preserve the repository's build order rules for future extension work.

## Build Order Rules

When extending the repo, keep this order:

1. schema and contracts
2. adapters and normalization
3. storage and read models
4. workbench surfaces and export
5. AI explanation after structure
6. optional/manual live validation only after deterministic gates are stable

## What To Avoid

- starting with UI polish before data truth exists
- adding AI-first shortcuts that bypass adapters and schema
- mixing manual live evidence back into canonical product docs
- adding heavy external checks to the default required CI lane

## How To Use This Brief

- use it as an extension-order guardrail
- use [`09-implementation-decisions.md`](09-implementation-decisions.md) for current locked choices
- use [`11-wave1-contract-freeze-gap-matrix.md`](11-wave1-contract-freeze-gap-matrix.md) when you need the current-vs-next-vs-later boundary
- use [`verification-matrix.md`](verification-matrix.md) for verification lanes
- use [`integration-boundaries.md`](integration-boundaries.md) for external boundary honesty

## Current Reality

The repository is no longer empty.

So future work should treat this document as:

- an execution-order constraint
- not a daily implementation diary
- not a second source of truth for current runtime evidence

## Current Wave Boundaries

Wave 1B locks the contract split:

- current formal scope
- next-phase engineering
- later / platform ambition
- explicit no-go

Use these guardrails for later waves:

1. Wave 2 deepens product-serving site capabilities on the existing workbench contract, preferably by filling already-promoted canonical fields first.
2. Wave 3 adds or evolves standalone WebUI only when it consumes imported or local workspace state on the same schema/read-model/export/AI truth.
3. Wave 4 improves surface quality, i18n, front-door clarity, and dual-surface convergence without overclaiming launch completeness.
4. Wave 5 extracts the internal Campus ↔ Switchyard seam, makes the runtime path Switchyard-first, and keeps browser evidence/control-plane work in the internal diagnostics substrate.
5. Wave 6 can promote truthful repo-public read-only builder packaging such as SDK / CLI / MCP / skills, plus the site API preview libs and site-scoped MCP story, only after the shared substrate and Switchyard seam are stable.
6. Wave 7 can prioritize launch/SEO/video only after the product and public contract are stable and owner-only settings are the main remaining work.
