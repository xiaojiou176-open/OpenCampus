# Site Depth Exhaustive Ledger

This ledger exists to answer one stricter question than the short capability matrix:

> For each supported campus site, which read-only resource families are already real, which deeper paths are still only selective gaps, and where should the remaining work be classified?

Use this file when you need the exhaustive current-vs-selective-vs-later map.  
Use [`site-capability-matrix.md`](site-capability-matrix.md) when you only need the short capability snapshot.

## Current Classification Summary

| Bucket | Meaning | Current items |
| :-- | :-- | :-- |
| `current direct enhancement` | Already landed on the current academic decision workspace contract | Canvas inbox messages; richer assignment submission/score context; Gradescope graded submission annotation detail; EdStem thread summary/category context; EdStem course resources; MyUW notice/class-exam detail |
| `selective gap` | Still valuable, but only if promoted through the same read-only workbench contract | Canvas richer reply/attachment context; MyUW registration/tuition-like signals; textbook/material signals |
| `internal substrate` | Helpful internal support or builder substrate, not student-facing scope by itself | browser evidence/control-plane tooling; site API preview libs; site-scoped read-only MCPs; redacted fixture capture path |
| `later / platform ambition` | Public distribution/launch work that follows stable substrate and truthful packaging | public registry publishing; plugin packaging; off-repo launch/SEO/video |
| `owner-only / external` | Human-controlled browser/session or publishing decisions outside repo-owned code paths | live campus sessions when the requested browser context is not attachable or the needed site is not currently open there; release-channel/package publishing decisions |
| `no-go` | Explicitly outside the current product boundary | write-capable automation; cookies expansion; hosted autonomy framing |

## Fresh Live Corroboration Note

The current site-depth contract is still primarily code-and-doc driven, not daily live-proof driven.

Latest manual corroboration on **April 4, 2026 PDT** used an explicit clone lane first:

```bash
CHROME_CDP_URL=http://127.0.0.1:9333 \
CHROME_USER_DATA_DIR="$HOME/.campus-copilot-profile13-clone" \
CHROME_PROFILE_NAME="Profile 13" \
CHROME_ATTACH_MODE=page \
pnpm probe:live
```

The shared `9333` lane was later shown to be contested by an unrelated browser automation process. A temporary clean-port recovery was attempted in the same turn and briefly surfaced stronger page-level evidence, but that alternate lane did not stay stable enough to promote its full site matrix into SSOT.

Treat the current live evidence as two layers:

- **reproducible repo-owned probe truth**: still the conservative, replayable lane for stop-rule judgment
- **same-turn stronger page evidence**: useful supporting evidence that the repo can push beyond simple `login_required`, but not yet a stable lane to cite as the new default truth

Treat that as a **current session-state fact**, not as a product-scope regression.  
In plain language: the code/doc contract for site depth is still intact, the repo can recover and interrogate stronger lanes in the same turn, but the remaining blocker has not yet been reduced to a clean owner-only tail because explicit clone listener continuity is still unstable.

## Exhaustive Per-Site Map

| Site | Resource family | Current path | Boundary type | Current code status | Current live proof status | Next deep gap | Action this round | Final classification |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| Canvas | `courses` | `/api/v1/courses` | `official` | Implemented on the shared schema/storage chain | Manual live validation still required for current session truth | none at this layer | keep as shipped scope | `current direct enhancement` |
| Canvas | `assignments` | `/api/v1/courses/:course_id/assignments?include[]=submission` | `official` | Implemented with `summary`, `submittedAt`, `score`, and `maxScore` on current entities | Manual live validation still required for current session truth | richer gradebook-only views if a later contract promotes them | keep current fields; do not invent a new domain | `current direct enhancement` |
| Canvas | `announcements` | `/api/v1/announcements?context_codes[]=course_*` | `official` | Implemented | Manual live validation still required for current session truth | none at this layer | keep as shipped scope | `current direct enhancement` |
| Canvas | `messages` | `/api/v1/conversations?scope=inbox` plus detail enrichment from `/api/v1/conversations/:id` when available | `official` | Implemented on the shared `Message` contract with attachment-aware latest-message summaries | Manual live validation still required for current session truth | deeper per-thread reply detail beyond the current latest-message body / attachment hint | keep landed inbox path and current detail-first summary enrich; classify fuller thread detail as selective | `current direct enhancement` |
| Canvas | `grades` | assignment submission fields from official assignment payloads | `official` | Implemented | Manual live validation still required for current session truth | deeper gradebook-only surfaces | keep current summary/score contract; do not overclaim a full gradebook product | `current direct enhancement` |
| Canvas | `events` | `/api/v1/calendar_events?context_codes[]=course_*` | `official` | Implemented | Manual live validation still required for current session truth | better event classification if later needed | keep as shipped scope | `current direct enhancement` |
| Gradescope | `courses` | internal assignment payload-derived course ids/names, fallback internal path or course/dashboard DOM | `internal`, `dom-fallback` | Implemented | Manual live validation required for current tenant/session | better internal-path selection across dashboard vs course context | keep current course discovery; do not widen product claim | `current direct enhancement` |
| Gradescope | `assignments` | `/internal/assignments`, fallback course DOM rows with submission drilldown links, plus graded submission enrichment from `/courses/:course_id/assignments/:assignment_id/submissions/:submission_id` with state-first parsing and DOM fallback in current course/submission context | `internal`, `dom-fallback` | Implemented with submission summary/score context plus question/rubric/evaluation-comment/annotation detail on current `Assignment.summary` + `Assignment.detail` | Manual live validation now has a reviewed redacted annotation fixture plus authenticated raw submission proof on the current carrier | richer page/image rendering semantics beyond the current annotation summary/detail contract | keep current assignment detail truthful; do not market a full annotated PDF viewer as shipped | `current direct enhancement` |
| Gradescope | `grades` | `/internal/grades`, fallback course DOM score cells with exact submission URL capture when present, plus direct submission-page DOM parsing for total score continuity | `internal`, `dom-fallback` | Implemented with current score context | Manual live validation required for current tenant/session | richer page/image rendering semantics beyond the current assignment-detail contract | keep current score contract; question/rubric/evaluation-comment/annotation detail promotes through `Assignment.summary` + `Assignment.detail`, not a new grade sub-entity | `current direct enhancement` |
| EdStem | `courses` | session-backed `api/user` memberships, fallback dashboard/course DOM metadata | `internal`, `session-backed`, `dom-fallback` | Implemented | Manual live validation required for current authenticated session | course-role / lab metadata if later promoted | keep current membership truth; defer extra metadata | `current direct enhancement` |
| EdStem | `messages` | session-backed `api/courses/:course_id/threads` plus inferred unread/recent-activity defaults, plus direct thread-detail DOM parsing for thread body and replies | `internal`, `session-backed`, `dom-fallback` | Implemented with thread summary/category context plus direct thread/reply DOM normalization on the shared `Message` contract | Manual live validation required for current authenticated session | richer attachment or cross-thread context only if a later contract needs it | keep landed thread summary + reply-body path truthful on the shared `Message` contract | `current direct enhancement` |
| EdStem | `resources` | session-backed `api/courses/:course_id/resources` with authenticated course-scoped download URL normalization | `internal`, `session-backed` | Implemented with canonical `Resource` entities, file metadata, and optional session-backed download URLs on the shared schema/storage/export chain | Manual live validation now has a reviewed redacted resources API fixture plus authenticated raw capture corroboration for the current carrier | broader grouped-material semantics or richer download UX beyond the current `Resource` contract | keep the current API-first resource carrier on the shared `Resource` contract; do not overclaim it as a stable public API | `current direct enhancement` |
| MyUW | `courses` | session-backed `/api/v1/schedule/current` primary-section records | `session-backed` | Implemented | Manual live validation required from a matching MyUW tab | additional authenticated homepage card families | keep as shipped scope | `current direct enhancement` |
| MyUW | `announcements` | session-backed `/api/v1/notices/`, fallback page state, then DOM | `session-backed`, `state-fallback`, `dom-fallback` | Implemented with current notice detail plus decision-layer promotion for registration / tuition-like reminders on the existing `Announcement` contract | Manual live validation required from a matching MyUW tab | broader homepage card expansion and standalone billing/enrollment domains | keep landed notice detail + reminder promotion; do not invent standalone billing/enrollment entities | `current direct enhancement` |
| MyUW | `events` | session-backed `/api/v1/visual_schedule/current` plus `/api/v1/deptcal/`, fallback page state, then DOM | `session-backed`, `state-fallback`, `dom-fallback` | Implemented with class/exam `location` and `detail`, plus decision-layer promotion for registration deadline-like reminders on the existing `Event` contract | Manual live validation required from a matching MyUW tab | additional homepage cards beyond the current schedule/reminder carrier | keep current schedule detail + reminder promotion; defer broader homepage/reg/tuition expansion | `current direct enhancement` |

## Selective Gaps That Are Still Worth Tracking

| Gap | Why it still matters | Why it is not current shipped truth yet | Classification |
| :-- | :-- | :-- | :-- |
| Canvas richer reply-body / attachment context | Could improve discussion and decision context beyond the current latest-message body / attachment hint | Full per-thread reply detail still needs a stronger formal contract on how deeper inbox content should normalize | `selective gap` |
| MyUW registration / tuition-like signals | Current notice/event reminders now reach the decision layer when they naturally arrive on existing carriers | A broader standalone billing/enrollment domain is still unstable and must not be over-promoted | `selective gap` |
| Textbook / course-material signals | Could matter for planning and workload | Stable source and current canonical contract are not locked yet | `selective gap` |

## Internal Substrate vs Later Packaging

| Surface | Current truth | Why it is not a student-facing scope claim |
| :-- | :-- | :-- |
| `@campus-copilot/gradescope-api`, `@campus-copilot/edstem-api`, `@campus-copilot/myuw-api` | Real repo-public preview libs over the current snapshot/shared-contract path | They are builder-facing preview packaging, not site-proof by themselves |
| site-scoped read-only MCPs | Real repo-public preview tooling over imported snapshots | They stay snapshot-first and do not prove live site collection or browser control |
| browser evidence / control-plane tooling | Real internal diagnostics substrate (`probe`, `diagnose`, `support-bundle`, evidence capture) | Internal/manual/live support lane, not formal student product scope |
| public registry publishing / plugin distribution | Still later | Requires release policy and packaging decisions beyond repo-local truth |

## Rules

- Do not describe `internal`, `session-backed`, `state-fallback`, or `dom-fallback` rows as official public APIs.
- Do not describe a `selective gap` as current shipped truth just because the current entity family could plausibly hold it.
- If a deeper capability becomes real, update this ledger and [`site-capability-matrix.md`](site-capability-matrix.md) in the same change.
- Keep live/browser corroboration in the manual lane; do not rewrite daily browser state into the formal product contract.
