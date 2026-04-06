# Current View Triage

Use this skill when you want one plain-language answer to the question:

- what should the student do first right now

Treat it like a quick triage card over one imported workspace snapshot or one local BFF-backed current view, not a live-browser playbook.

## Inputs

- one snapshot path, or one current-view export derived from the same shared contract
- optional question for the local Campus consumer seam

## Steps

1. Build a workspace summary from the imported snapshot.
2. Inspect the top Focus Queue items and recent updates.
3. If a question is provided, ask the local Campus consumer seam for a cited answer.
4. Return the answer with trust gaps instead of inventing missing facts.

## Good fit

- Codex or Claude-style first-pass triage over a snapshot
- OpenClaw-style local consumers that need one short "what now" brief
- repo-local verification that the decision layer is understandable before reopening live browser work

## Hard boundary

- stay on imported snapshots or the thin local BFF
- do not claim live browser/session truth from snapshot-only evidence
- do not mutate site state

## Companion references

- `examples/workspace-snapshot.sample.json`
- `examples/cli-usage.md`
- `examples/openclaw-readonly.md`
