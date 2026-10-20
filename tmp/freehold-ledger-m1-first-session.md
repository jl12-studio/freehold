Please follow the `linear-project-workflow` skill.

Work in `/Users/marcus.salinas/Programming/Personal/freehold-ledger`. It does not exist yet: creating it as its own git repo is part of JIP-470. Until then, read the philosophy and standard from `/Users/marcus.salinas/Programming/Personal/freehold` (that repo is the movement and the website only; app code never goes in it).
Linear project: `Freehold Ledger` - https://linear.app/jippylong12/project/freehold-ledger-3aeec41a94a4
Linear milestone: `M1: Foundation & Data Model`
Figma source: none
Use this project as the source of truth. Do not select work from the global Linear issue list unless Marcus explicitly asks for global triage.

Implement this Linear milestone pass in order:
- `JIP-469`: Define the ledger data model in plain language - https://linear.app/jippylong12/issue/JIP-469/define-the-ledger-data-model-in-plain-language
- `JIP-470`: Founding decisions: license, repo, and platform approach (name decided: Freehold Ledger) - https://linear.app/jippylong12/issue/JIP-470/founding-decisions-license-repo-and-platform-approach-name-decided

Do not work on these adjacent-milestone or blocked issues in this pass:
- `JIP-471` to `JIP-476`, `JIP-480`: M2 to M4 and M6 (app code, MCP surface, tax output, import), all blocked on M1 decisions.
- `JIP-477` to `JIP-479`: Canceled. Cloud was descoped to a future stage; do not resurrect them.

Context:
- Read `README.md` in the freehold repo first for orientation, then `FRAMEWORK.md` (Part 0 defines Freehold, Part 1 is the 10-point standard, Part 2 the build order, Part 3 this app) and the "QuickBooks example" in `PHILOSOPHY.md`. The project encodes these; the framework's core-principles-first rule applies (no premature stack lock-in).
- Freehold Ledger is the first Freehold app. Stage 1 of the Desktop → Cloud → Mobile progression: local desktop only (Mac priority), built-in MCP server. Cloud/mobile are future stages with their own projects, possibly never built; the local app must be complete on its own.
- The name is decided (Freehold Ledger). JIP-470's remaining work: license (Marcus must approve it before it's locked in), platform approach, and creating the `freehold-ledger` repo.
- M1 produces documents and decisions only, no app code.
- No em dashes in anything you write for Marcus. Use periods, commas, colons, or parentheses.

Classify the work state as `investigation-only`, `non-ui-code`, `ui-code`, or `blocked`. (M1 is expected to be `investigation-only`/docs plus repo creation; treat it as `non-ui-code` at most.)

Completion rules:
- For investigation-only work, report findings, comment on Linear with evidence, and move the issue to Done if acceptance criteria are met.
- For non-UI code work, run relevant automated validation, comment on Linear with results, and move completed issues to Done.
- For UI code work, run automated validation, provide a concrete manual test script, and wait for Marcus's manual approval before moving issues to Done.
- For blocked work, comment on Linear with the blocker and keep the issue open.

Work milestone-first: complete/update each included issue as its acceptance criteria are met, then continue to the next ready included issue. Perform code handoff actions or workspace cleanup only if Marcus explicitly requests those actions.
