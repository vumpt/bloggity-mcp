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
