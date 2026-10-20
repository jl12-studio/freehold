# The Build Framework

> Core principles and order of operations for building any application under this philosophy. Deliberately **not** a technical spec: software changes too fast. Stick to core principles; the human and the AI of the moment figure out the best implementation together. Companion to [PHILOSOPHY.md](PHILOSOPHY.md); orientation in [README.md](README.md).

---

## Part 0: The Name, and What Makes Software Freehold

**Freehold** is a legal term: owning property outright, as opposed to *leasehold*, where you rent from a landlord. Subscription software is leasehold. **Freehold software is software you own outright:** free license, your data, your deployment, your choice of providers. No landlord. No middleman.

**Freehold is a status, not a brand.** Like "open source" or "fair trade," it is a condition any software can earn by meeting the standard in Part 1. Nobody owns the word. The definition is public. Anyone whose software meets it may call that software Freehold, whether or not anyone here has heard of them.

**The people are freeholders.** Anyone who runs their own software on their own terms is a freeholder. The movement lives at **freeholders.org**. (Historical echo, not a claim: in England and colonial America, freeholders, people who owned land outright, were the ones who qualified to vote. The enfranchised people. It sits naturally next to the big-G Government idea in PHILOSOPHY.md.)

**The naming pattern: Freehold + plain noun.** Freehold Ledger, Freehold Invoices, Freehold Records. The family word carries the philosophy; the noun just says what the thing does. The pattern scales to thousands of apps and stays instantly identifiable.

**What keeps Freehold a movement instead of one person's project:**

1. **The standard is published openly.** Part 1 of this document is the definition. It belongs to everyone.
2. **There is no sole registry.** The curated list maintained here is *one* Freehold registry. The standard explicitly permits others. Certification is checking the list in Part 1, not asking anyone's permission.
3. **The founder is replaceable.** Lincoln's principle from PHILOSOPHY.md: the leader is not the movement. If this repo vanished, the definition would still work.

## Part 1: The Freehold Standard (what every app must satisfy)

An app is Freehold only if it meets all of these. This checklist is also the curation criteria: an app is "in" because it passes, not because someone likes it.

1. **Free, and owned by the person.** Free license, their data, their deployment, their instance. No telemetry, no phone-home, no account with us.
2. **Deployable anywhere.** Releases ship pre-built for every reasonable target (local desktop, any cloud server, ideally cheap hardware). The person's *agent* performs the deployment. We never run infrastructure for anyone.
3. **Speaks MCP natively.** The app ships with its own MCP server so any agent can operate it, locally or remotely. The MCP surface is a first-class interface, not a bolt-on.
4. **Hub-and-spoke sync, self-managed.** The person's deployed instance is the single source of truth; other devices are clients of it. Sync is set up by the software itself, never a service someone else runs.
5. **A declared conflict story.** Every app states how it handles offline edits, even if the answer is "you can't edit offline." Append-mostly designs (ledgers, logs) are preferred because they make this easy.
6. **Agent-operable administration.** Backup, restore, verify, and upgrade are exposed as MCP tools so the agent is the sysadmin. Owning your data must not mean owning your data loss.
7. **Secure by default.** Authenticated endpoints and encrypted transport out of the box. The audience is beginners; the defaults must protect them.
8. **Self-carrying upgrades.** Auto-versioning includes data migrations; pinning a version forever must also keep working.
9. **Usable by conversation.** The primary UX is a person telling their agent what they need ("add this $300 device to the books"). A screen UI is welcome but secondary.
10. **Teaches while it works.** Wherever natural, the app should build the person's understanding (teach-to-fish), not just do the task silently.

## Part 2: Order of Operations (how to build any app)

Build in this order. Each step is a milestone that works on its own before the next begins.

1. **Write the scene.** One paragraph: a specific person, a specific moment, what they say to their agent, what they get. (The ledger's scene already exists: the "QuickBooks example" in PHILOSOPHY.md.) If you can't write the scene, don't build the app.
2. **Define what the person owns.** The data model, in plain language: what records exist, what must never be lost, what gets exported at the end (e.g., "everything my tax preparer needs"). Prefer append-mostly designs.
3. **Build the local, single-user core.** The app running on one machine, storing data in one owned database, doing the essential job. No sync, no cloud, no multi-device. It must already be genuinely useful here.
4. **Build the MCP surface.** Expose the core's operations as MCP tools; drive the whole scene from Step 1 through an agent conversation. This is the moment the app joins the ecosystem.
5. **Make it deployable.** Pre-built releases; an agent (not a human following docs) can install it locally or on a cloud server the person chose.
6. **Add sync.** Hub-and-spoke from the deployed instance; declare the conflict story.
7. **Add agent-operable administration.** Backup/restore/verify/upgrade as MCP tools, secure defaults, migrations.
8. **Write the two guides.** One for the human (what this is, what you own, the scene), one for the agent (how to deploy, operate, and administer it). The agent guide is what makes the app self-serve for the next person.

**Ship after Step 4.** Steps 1 through 4 are the MVP: a person with an agent and one machine already gets the full value. Steps 5 through 8 make it an ecosystem citizen.

**The stage progression: Desktop → Cloud → Mobile.** Steps 1 through 4 are the Desktop stage; steps 5 through 7 belong to the Cloud stage; mobile comes after cloud. Each stage is a separate project, and a later stage may never be built. That's fine, because each stage must be complete and genuinely useful on its own. Desktop goes first because it's the easiest honest target: it's not locked down, and everyone has one.

## Part 3: The First Application: Freehold Ledger

**Working scene** (from PHILOSOPHY.md): a new business owner can't afford $20/month for QuickBooks. Their agent deploys the free accounting app. From then on, bookkeeping is talking: *"I bought a $300 device, add it to the books so it's ready when I file taxes."* The records live in a database they own.

**Scope for v1 (Steps 1 through 4 only):**
- Track income, expenses, and assets: the append-mostly ledger a very small business needs.
- Categorization that maps to what tax filing will ask for.
- An export a tax preparer (human or AI) can consume.
- Operated entirely through MCP by conversation; minimal or no screen UI.

**Explicitly out of scope for v1:** invoicing, payroll, multi-user, bank integrations, tax *advice* (the AI layer handles knowledge; this app is the trusted place to track).

**Where it lives:** its own repo, `~/Programming/Personal/freehold-ledger` (decided 2026-10-20; not created yet). The `freehold` repo is the philosophy, the standard, and the site only; apps are never inside it, they're listed by the marketplace page. Other people's Freehold software lives wherever they like. **Name decided 2026-10-20: Freehold Ledger.** Tracked in Linear: https://linear.app/jippylong12/project/freehold-ledger-3aeec41a94a4

## Part 4: Open build questions

- What license best encodes "free and owned" for this ecosystem? (To research when building starts; Marcus approves it.)
- Minimum viable deploy targets for v1 Step 5: which one or two first?
- Does the ledger export target a standard format so any tax tool can consume it?
