# Integration Boundaries

This file is the explanation layer for external integration risk.

The machine-readable source of truth now lives in:

- [`../policies/integration-boundaries.yaml`](../policies/integration-boundaries.yaml)

Use this Markdown file when you need the human explanation.
Use the YAML file when a script, policy check, or future automation needs canonical boundary facts.

## Why This Registry Exists

“Supported” does not always mean:

- official
- stable
- low-risk

The repository must describe deep-water paths honestly so that public docs, README copy, changelog text, and future automation do not quietly over-claim them.

## Boundary Classes

| Class | Meaning |
| :-- | :-- |
| `official` | documented public contract or clearly supported API surface |
| `internal` | private/internal endpoint or undocumented request surface |
| `session-backed` | depends on authenticated browser session state or page-local token material |
| `state-fallback` | uses page bootstrap state or equivalent injected state |
| `dom-fallback` | uses DOM parsing as a fallback layer |

## Academic Expansion Source Order

Any future academic expansion must stay in this order:

1. `official public API`
2. `institution-recognized stable session-backed interface or standard integration`
3. `page-state / internal endpoint / reverse-engineered path / DOM fallback`

This is the rule that keeps the repo honest when a hidden endpoint looks convenient.
Convenient does not automatically mean official, stable, or safe to overclaim.

## Current Registry Summary

| Site | Primary path | Boundary classes | Validation expectation |
| :-- | :-- | :-- | :-- |
| Canvas | `/api/v1/*` | `official` | deterministic repo coverage plus manual live validation when needed |
| Gradescope | `/internal/*` plus DOM discovery | `internal`, `dom-fallback` | deterministic adapter tests plus manual live validation for current tenant behavior |
| EdStem | session-backed `api/user` + `api/courses/:id/threads` requests, with inferred `/internal/unread` and `/internal/recent-activity` defaults plus DOM fallback | `internal`, `session-backed`, `dom-fallback` | deterministic adapter tests plus manual live validation for the current authenticated session |
| MyUW | session-backed `/api/v1/schedule/current` + `/api/v1/notices/` + `/api/v1/visual_schedule/current` + `/api/v1/deptcal/`, fallback page state, then DOM bridge | `session-backed`, `state-fallback`, `dom-fallback` | deterministic adapter tests plus manual live validation from a matching tab context |
| BFF provider status | local loopback API | `official` | deterministic repo gate |
| Provider round-trip | `OpenAI` / `Gemini` API-key flow | `official` | optional local smoke, not required CI |

## Planned Read-Only Expansion Registry

These are read-only expansion registry surfaces, not automatic full shipped integrations.
Some rows below now have limited repo-side/workbench adoption, but they still require narrow wording and must not be overstated.

| Site | Planned posture | Boundary classes | Validation expectation |
| :-- | :-- | :-- | :-- |
| MyPlan | read-only academic-planning lane; prefer official/public planning surfaces before session-backed or DOM fallback, and do not treat historical Kuali lineage as proof of a current public API | not yet locked | a shared planning substrate now exists in storage, extension/web `Planning Pulse` adoption is landed, and manual live validation is still required before any stronger claim |
| DARS | read-only degree-audit lane; prefer official/public degree-audit surfaces before session-backed or DOM fallback | not yet locked | contract design first, then deterministic adapter tests plus manual live validation |
| Time Schedule | read-only catalog/schedule lane; prefer official/public schedule surfaces before session-backed or DOM fallback | not yet locked | a repo-side shared runtime landing now exists on the public course-offerings carrier, and broader docs/product wording still needs follow-through |
| DawgPath | read-only program-path lane; prefer official/public program-path surfaces before session-backed or DOM fallback | not yet locked | contract design first, then deterministic adapter tests plus manual live validation |
| ctcLink class search | class-search-only discovery lane; validate institution-by-institution before trusting internal endpoints or DOM fallback, and do not market current carriers as a stable anonymous API across every school | `internal`, `dom-fallback` likely candidates until a stronger carrier is proved | school-by-school validation plus deterministic adapter tests once a stable carrier is proved |

## Red-Zone Exclusions

These surfaces are not “future maybe” items for the current contract.
They are explicit no-go areas unless a new higher-authority contract overrides them.

| Surface | Current status | Why |
| :-- | :-- | :-- |
| `Register.UW` | `no-go` | registration automation, submission flows, and registration-related polling are out of scope |
| `Notify.UW` | `no-go` | seat-watching, registration-related polling, and notification automation are out of scope |
| registration-related resources | `no-go` | protected registration resources must not become automation or polling targets |
| seat-watcher / waitlist polling | `no-go` | repeated seat-availability checking crosses into protected registration automation behavior |
| add/drop submission flows | `no-go` | the current contract never submits registration-state mutations |
| seat-swap / hold-seat helpers | `no-go` | these are operator actions, not read-only academic-observation surfaces |
| registration-related automated query loop | `no-go` | looped registration checks are explicitly outside the current read-only posture |

## Source Precedence

Future academic expansion must follow this order:

1. `official public API`
2. `institution-recognized stable session-backed interface or standard integration`
3. `page-state / internal endpoint / reverse-engineered path / DOM fallback`

Use the strongest available carrier first.
Do not skip straight to reverse-engineered or DOM paths when a stronger official surface already exists.

## AI / Material Boundary

The boundary registry also assumes:

- default AI inputs stay on normalized entities, structured summaries, local decision views, file names, metadata, and jump links
- raw course files, instructor-authored materials, exams, quizzes, assignment PDFs, solution documents, and unclear-rights course materials stay out of the default AI path
- the current advanced material-analysis lane is limited to explicit per-course opt-in with a user-pasted excerpt
- any broader advanced material-analysis lane would still require a separate review and a lawful raw-material carrier

## Cross-Surface Inheritance

The same academic safety contract follows the repo across:

- browser extension
- standalone web workbench
- MCP servers
- public skills
- SDK / CLI / site API preview packages
- plugin-grade repo bundles
- containerized local BFF routes
- distribution-facing docs

Changing the delivery surface does not create extra permission.
An MCP route is still not a campus-site operator, and a plugin bundle is still not an official campus-system integration.

## Public Honesty Rules

Use wording like:

- official path
- internal path
- session-backed
- state fallback
- DOM fallback
- manual live validation required

Avoid wording like:

- stable forever
- fully verified public integration
- official for private/internal/session-backed paths
- stable anonymous public API for every `ctcLink` school
- official or approved automation for red-zone registration surfaces

## Review Rule

If README, changelog, or any public note mentions a site capability, it must stay consistent with the YAML registry.
