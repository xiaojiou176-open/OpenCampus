# GitHub Surface Checklist

This checklist exists because some repository-adjacent facts live in GitHub settings, not in git-tracked files.

Use it to avoid writing platform-side unknowns into `README.md` as if the repository had already proven them.

## Manual Settings Checklist

| Item | Where to check | Repo can prove it? | Last checked | Notes |
| :-- | :-- | :--: | :-- | :-- |
| Repository description | GitHub repository settings / page header | No | 2026-04-06 | Current value: `AI-ready academic decision workspace with cited study context from Canvas, Gradescope, EdStem, and MyUW.` This still matches the post-Wave47 front-door positioning. |
| Homepage / website URL | GitHub repository settings | No | 2026-04-06 | Still intentionally blank for the current GitHub-first storefront phase. Do not invent a homepage URL. |
| Topics | GitHub repository settings | No | 2026-04-06 | Current topics: `browser-extension`, `canvas`, `education`, `gradescope`, `local-first`, `student-productivity`, `typescript`, `ai`, `decision-support`. |
| Social preview image | GitHub repository settings | No | 2026-04-06 | Custom social preview is currently **not** enabled on the new public repo (`usesCustomOpenGraphImage=false`). Repo-tracked upload source remains `docs/assets/social-preview.png`, so uploading it is now a settings-only owner action if you want the custom share card back. |
| Discussions enabled | GitHub repository settings | No | 2026-04-06 | Enabled (`has_discussions=true`). |
| Branch protection | GitHub branch protection settings | No | 2026-04-06 | `Verify`, `CodeQL`, and `Security Hygiene` required; `strict=true`; admins enforced; linear history required; conversation resolution required; force-push and deletion disabled. The current public repo still enforces the same protection parity after cutover. |
| PR author identity for workflow-triggered closeout | GitHub CLI auth context + PR author | No | 2026-04-06 | `gh auth status` now shows `xiaojiou176` active and valid again, with repo-admin scopes including `delete_repo`, `repo`, `workflow`, and `write:packages`. Treat `xiaojiou176` as the default authoring identity; keep `leilei999lei-lab` for review-side use if a second human review lane is still needed. |
| Default workflow permissions | GitHub Actions settings | No | 2026-04-06 | `default_workflow_permissions=read`; `can_approve_pull_request_reviews=false`. |
| Auto merge | GitHub pull request settings | No | 2026-04-06 | Disabled (`allow_auto_merge=false`). |
| Fork PR contributor approval policy | GitHub Actions settings | No | 2026-03-29 | `approval_policy=first_time_contributors_new_to_github`. |
| Code scanning visibility | GitHub security tab + workflow logs + code scanning API | No | 2026-04-06 | Fresh closeout checks proved the repo now lands real advanced-setup CodeQL uploads: the old `Detect code scanning availability` gate was removed, `code-scanning/analyses` became non-empty for the branch and PR refs, and `code-scanning/alerts?state=open` currently returns `[]`. `default-setup` remains `not-configured`, which is expected for this advanced-setup path. |
| Private vulnerability reporting | GitHub security settings | No | 2026-04-06 | Enabled via API check (`enabled=true`). This remains a platform-side setting, not a git-tracked repo fact. |

## Repo-Tracked Signals

These are the things the repository itself can prove:

- `LICENSE`
- `CONTRIBUTING.md`
- `CLAUDE.md`
- `SECURITY.md`
- `CODEOWNERS`
- issue templates
- PR template
- workflow files
- Dependabot config

## Rules

- Do not copy GitHub settings status into `README.md` as a stable repo fact.
- If you mention a settings-only item in docs or a PR, record the date in this checklist.
- If an item is not checked, say `unknown` instead of pretending it is enabled.
