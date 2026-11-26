# Marketplace connectors

One plugin, several marketplaces, none published yet. Each connector lives in a
dot-folder and points at the same `skills/` and the same hosted MCP URL. All
install paths other than the generic remote-MCP config in the README are
**pending**.

| Path | Client | Reads | Status |
|---|---|---|---|
| `.claude-plugin/plugin.json`, `marketplace.json` | Claude Code | `.mcp.json`, `skills/` (defaults) | Unpublished |
| `.cursor-plugin/plugin.json` | Cursor | `mcp.json`, `skills/` (defaults) | Unpublished |
| `.codex-plugin/plugin.json`, `.agents/plugins/marketplace.json` | Codex | `agents/codex/.mcp.json`, `skills/` | Unpublished |
| `.grok-plugin/plugin.json` | Grok Build | `.mcp.json`, `skills/` | Unpublished |
| hosted server URL | Claude Connectors Directory | `https://mcp.bloggity.io/mcp` | Not submitted |
| hosted server URL | ChatGPT plugin directory | `https://mcp.bloggity.io/mcp` | Not submitted |
| `server.json` | Official MCP Registry | `server.json` | Not published |
| hosted server URL | Smithery | `https://mcp.bloggity.io/mcp` | Not submitted |
| `glama.json` | Glama | `glama.json`, hosted server URL | Not claimed |
| hosted server URL | mcp.so | `https://mcp.bloggity.io/mcp` | Not submitted |

Accuracy notes: the Claude Code and Grok layouts were checked against their
official docs. The Cursor layout follows Cursor's plugin template; the Codex
manifest follows a live Codex plugin (Locus) and third-party summaries because
the official pages were not reachable. Verify both against current docs before
submitting. Codex MCP headers use `http_headers`; the others use `headers`.

Bump `version` in every `plugin.json` together, then run `node scripts/validate.mjs`.

## Claude Code

Validate with `claude plugin validate .`. Users add the repo with
`/plugin marketplace add <owner>/<repo>` once it is published.

## Cursor

Single-plugin layout: `.cursor-plugin/plugin.json` at the repo root. Submit at
cursor.com/marketplace/publish. Plugins are reviewed manually and must be open
source; the README must state purpose, installation and components.

## Grok Build

Source: <https://github.com/xai-org/plugin-marketplace/blob/main/CONTRIBUTING.md>.
A PR adds one entry to `.grok-plugin/marketplace.json` in that repo.

1. Fork `xai-org/plugin-marketplace`, branch from `main`.
2. Pin the commit: `git ls-remote https://github.com/vumpt/bloggity-mcp HEAD`
   (full 40-char SHA; branches, tags and short SHAs are rejected).
3. Add the entry from `docs/grok-marketplace-entry.json` with the SHA. Match an
   existing `category` value from their catalog.
4. Run `scripts/generate-plugin-index.py`, then `scripts/validate-catalog.py` and
   `scripts/generate-plugin-index.py --check`. Commit the regenerated index.
5. Open the PR using their template.

Their guide asks for an official organization source (not a personal account),
a reachable pinned commit, minimal access, brand-scoped keywords, and declared
endpoints (see README).

## Codex

Layout and fields follow `.codex-plugin/plugin.json` with an `interface` block.
Confirm required fields against OpenAI's current plugin docs before listing.

## Shared listing material

- Name: Bloggity (no "MCP" or "plugin" suffix; ChatGPT rejects it).
- One-liner: "Manage your Bloggity SEO blog: tasks, schedule, keywords, research and post analytics."
- Docs: <https://bloggity.io/mcp> · Privacy: <https://bloggity.io/privacy> · Terms: <https://bloggity.io/terms>
- Support: privacy@vumpt.com
- Logo: `assets/logo.png` (512 × 512 PNG, transparent corners). Use it for every portal.
- Test prompts: [test-prompts.md](test-prompts.md).
- Reviewer account: a dedicated Bloggity account with a blog, posts, a schedule,
  keywords, research and analytics data, and credits. Password sign-in, no
  email code. Keep its credentials outside this repo.
- Do not mention pricing, trials or offers in listing copy (ChatGPT rule).

## Claude Connectors Directory

Source: <https://claude.com/docs/connectors/building/submission>.

1. Add the server as a custom connector in Claude and run every tool once
   (the portal asks you to confirm this).
2. Submit from the Claude directory portal (paid Claude plan): server URL,
   listing (name ≤ 100 chars, one-liner ≤ 200, description ≤ 2,000, 1–5
   categories, docs URL, privacy URL, support contact, icon, URL slug
   `bloggity`, which cannot change later), use cases, company, authentication
   (OAuth, sign-in required), data handling (first-party API), reviewer test
   steps and credentials, and the seven policy acknowledgements.
3. The portal syncs tools and flags any tool without a `title` or hints.
4. Track status at claude.ai/directory/manage; questions to mcp-review@anthropic.com.

### Plugin bundle (connector + skill)

Source: <https://claude.com/docs/plugins/submit> and
<https://claude.com/docs/directory/publish>. Anthropic asks for a remote MCP
server to be submitted as an MCP connector even when a plugin references it,
so Bloggity is two submissions that are paired into one listing:

1. Submit the MCP connector (above).
2. In the same portal, choose **Plugin bundle**. Repository
   `vumpt/bloggity-mcp`, plugin path empty (the repo root), branch `main`.
   The listing is read from `.claude-plugin/plugin.json` (`displayName`,
   `description`, `icon`, `documentationUrl`, `supportUrl`,
   `privacyPolicyUrl`, `termsOfServiceUrl`) and `README.md`.
3. Data handling: reads account data through the connector only; sends
   nothing to other services; keeps no data itself; not for under-18s.
4. Pair the plugin with the connector listing (same organization, same URL
   in `.mcp.json`).
5. Run `claude plugin validate .` before you submit. The repo must be public
   before the listing goes live.

## ChatGPT plugin directory

Source: <https://developers.openai.com/plugins/deploy/app-review>.

1. Verify the business (VUMPT Ltd) in the OpenAI Platform dashboard. Use a
   project with global data residency, not EU.
2. Create the plugin, enter the server URL and run **Scan Tools**. Annotation
   changes need a server deploy and a rescan.
3. Fill in name, logo, description, company URL, privacy URL, OAuth details,
   reviewer credentials, test prompts with expected responses, and target
   countries.
4. After approval, publish as a separate step. Tell press@openai.com before
   any public announcement.

## Official MCP Registry

Source: <https://registry.modelcontextprotocol.io>. Glama, PulseMCP and
GitHub's MCP list read from it.

1. Install `mcp-publisher` (release binary from
   github.com/modelcontextprotocol/registry).
2. `mcp-publisher login github` as a member of the `vumpt` org (the name
   `io.github.vumpt/bloggity-mcp` needs it). For an `io.bloggity/...` name,
   use `mcp-publisher login dns` with a TXT record on bloggity.io instead.
3. `mcp-publisher publish` from the repo root. Bump `version` in
   `server.json` for each new publish.

## Smithery

Source: <https://smithery.ai/docs/build/publish>.

1. Go to smithery.ai/new, enter `https://mcp.bloggity.io/mcp`, finish the
   flow, and sign in when Smithery asks (it scans the tools after sign-in).
   No `smithery.yaml` or Dockerfile is needed for a URL-published server.
2. Smithery registers itself with a Client ID Metadata Document, so
   `smithery.ai` must be on the server's CIMD host allowlist. If sign-in
   fails, check the server's OAuth log for the rejected CIMD host.
3. Its scanner sends `User-Agent: SmitheryBot/1.0`; do not block it.
4. Then Settings → Verification for the official-vendor badge.

## Glama

Sources: <https://glama.ai/blog/2025-07-08-what-is-glamajson>,
<https://glama.ai/mcp/methodology>.

1. `glama.json` lists the GitHub maintainers who may claim the listing (an
   org repo cannot be claimed through GitHub login alone).
2. Find or add the server on glama.ai, then run **Claim**. Run it again after
   any change to `glama.json`.
3. Admin → Test Profile: authorise a dedicated test account. Glama only runs
   `initialize` and the list methods; it never calls tools.

## mcp.so

1. Open <https://mcp.so/submit?type=remote-server>, enter the endpoint URL
   and the name "Bloggity". mcp.so fetches the tools; review them and submit.
2. A free listing goes live after review. A paid listing (one-time fee)
   goes live at once with a verified badge and a dofollow link.
