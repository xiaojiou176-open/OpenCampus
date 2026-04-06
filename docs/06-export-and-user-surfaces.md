# Export And User Surfaces Brief

This repository is not built around an empty chat box.

Its user-facing shape is a workbench with export and AI as parallel formal paths.

## Current Formal Surfaces

- `sidepanel`
- `popup`
- `options`
- `web`
- export presets
- AI explanation after structure
- `Focus Queue`
- `Weekly Load`
- `Change Journal`
- `Discussion Highlights`
- `Schedule Outlook`
- derived priority alerts
- cited AI explanation

## Current Formal Surface Direction

The current formal surface goal is a **learning decision layer**, not a broader chat shell.

That direction should materialize as:

- `sidepanel` as the primary home for decision views
- `Focus Queue` as the first-class “what should I do first?” surface
- `Weekly Load` as the first-class planning surface
- `Change Journal` as the first-class “what changed?” surface
- cited AI explanations that point back to structured entities

These are part of the current formal surface shape.

The standalone web surface is now formalized as a **read-only second surface**:

- it consumes imported workspace snapshots on the same schema/storage/export contract
- it does not introduce a second sync engine
- it does not bypass the thin BFF or the decision-layer contract

## Surface Boundary For Next Phase

The current formal shipped surfaces are now:

- `sidepanel`
- `popup`
- `options`
- `web`
- export
- cited AI over structured results

The current web surface remains intentionally narrow:

- import or load a local workspace snapshot
- render the same decision-layer views
- export the same current-view/focus/weekly/change artifacts
- ask cited AI through the same thin BFF contract

It must not be marketed as a site-syncing standalone shell until a later contract explicitly promotes that path.

## Surface Rules

- show structured state before asking users to type
- keep popup lightweight
- use sidepanel as the main workbench surface
- let site status cards reflect the structured per-site entity counts from storage, including courses and events when present
- keep export first-class, not hidden behind AI
- keep diagnostics honest about missing prerequisites
- derive decision surfaces from storage read models and local overlay, not from raw site responses
- keep priority alerts derived from current structured facts and sync state instead of treating them as a separate persisted source of truth
- do not expand the formal surface area by adding new sites, provider/auth paths, or write operations first

## Current Export Presets

- current view
- weekly assignments
- recent updates
- all deadlines
- focus queue
- weekly load
- change journal

The current-view export and the cited AI payload should carry the same decision-layer evidence:

- current filtered entities
- `Focus Queue`
- `Weekly Load`
- recent change events
- recent sync receipts
- change journal

The decision-layer presets should stay aligned with the workbench itself:

- focus queue export should preserve score, reasons, and local note context instead of re-deriving them in the exporter
- weekly load export should preserve planning-oriented summaries from the derived storage read model
- change journal export should preserve sync-run receipts and change events as the formal “what changed?” export path

## Why This Matters

The repository's value is:

- one local structured view
- one local layer for user judgment
- one derived layer for decision-making
- lower switching cost
- lower noise
- easier export
- easier explanation

not “another generic sidebar assistant.”

## Canonical Cross-References

- Product boundary: [`01-product-prd.md`](01-product-prd.md)
- Runtime chain: [`02-system-architecture.md`](02-system-architecture.md)
- Locked implementation choices: [`09-implementation-decisions.md`](09-implementation-decisions.md)
- Wave 1B contract freeze ledger: [`11-wave1-contract-freeze-gap-matrix.md`](11-wave1-contract-freeze-gap-matrix.md)
