# Product Brief

Campus Copilot is a local-first study workspace for students who need one structured place to understand work across:

- Canvas
- Gradescope
- EdStem
- MyUW

## What The Product Does

It consolidates multi-site academic information into normalized local entities, then supports:

- workbench-style reading in the extension
- local user judgment on top of structured facts
- decision views that answer what to do first and what changed
- export of structured results
- AI explanation after structure with citations

## Primary User Questions

- What assignments are still open?
- What changed recently across my classes?
- What should I pay attention to first?

## Current Formal Product Direction

The repository is no longer optimizing for “more integration breadth first.”

The current formal product direction is:

- preserve canonical site facts from supported sites
- add a separate local user-state overlay for personal judgment
- derive decision views that answer what to do first and why
- keep export and AI aligned with those structured decision views

This remains a hard cut against the wrong narrative:

- do not treat new sites as the current formal product milestone
- do not treat new provider or auth paths as the current formal product milestone
- do not treat a larger chat shell as the current formal product milestone

## Current Formal Product Shape

- read-only workflow
- manual sync
- local-first storage and workbench views
- local user-state overlay for personal judgment
- Focus Queue, Weekly Load, and Change Journal as decision-facing surfaces
- richer assignment submission context, discussion highlights, and class/exam location context when they normalize into existing canonical entities
- a standalone read-only web workbench that consumes imported workspace snapshots on the same storage/export/AI contract
- export as a first-class path
- thin BFF for `OpenAI` and `Gemini` API-key flows
- citation-aware AI answers over structured results

## Current Phase Boundary

The Wave 1B contract freeze separates three different promises:

- **current formal scope**: the existing four-site decision workspace and its current explanation/runtime path
- **next-phase engineering**: product-serving depth that strengthens the same workspace, such as richer `Gradescope` page / image rendering beyond the current graded-submission question/rubric/evaluation-comment/annotation detail path and selective `registration / tuition / textbook` promotion on the same contract
- **later ambition**: internal private clients, public `MCP / SDK / CLI / Skills / plugin`, and launch-facing `SEO / video`

Selective new academic domains such as textbook/material or tuition-like signals only graduate into the contract through the same next-phase engineering lane; they are not implied current scope.

## Explicit Non-Goals

- generic web chatbot behavior
- expanding supported sites before the decision layer exists
- expanding provider/auth formal paths beyond `OpenAI` and `Gemini` API-key flows
- automatic posting, submission, or other write operations
- raw-cookie product paths
- AI-first scraping that bypasses adapters and schema
- public write-capable `MCP`
- hosted autonomy repositioning

## Canonical Cross-References

- Current locked choices: [`09-implementation-decisions.md`](09-implementation-decisions.md)
- Wave 1B contract freeze ledger: [`11-wave1-contract-freeze-gap-matrix.md`](11-wave1-contract-freeze-gap-matrix.md)
- Validation boundaries: [`verification-matrix.md`](verification-matrix.md)
- Integration risk classes: [`integration-boundaries.md`](integration-boundaries.md)
