# Marketplace connectors

One plugin, many marketplaces. Each connector lives in a dot-folder and points
at the same `skills/` and the same hosted MCP URL.

| Path | Marketplace / client | Status |
|---|---|---|
| `.cursor-plugin/` | Cursor Marketplace | Ready to submit |
| `.claude-plugin/` | Claude Code (plugin + marketplace) | Ready |
| `.codex-plugin/` | Codex | Manifest only; verify against Codex docs before listing |
| `.grok-plugin/` | Grok Build (xai-org/plugin-marketplace) | Ready to submit |
| `.mcp.json` | Generic MCP config (used by Grok at root) | Ready |
| `agents/<client>/` | Per-client MCP server config | Ready |

Bump `version` in every `*-plugin/plugin.json` together, then run
`node scripts/validate.mjs`.

## Cursor

Single-plugin layout: `.cursor-plugin/plugin.json` at the repo root, no
`marketplace.json`. Checklist (from the Cursor plugin template): valid manifest,
lowercase kebab-case name, frontmatter on every skill, logo committed and
referenced by relative path, validator passes. Submit the repo link to the Cursor
team (Slack or `kniparko@anysphere.com`).

## Grok Build

Source: <https://github.com/xai-org/plugin-marketplace/blob/main/CONTRIBUTING.md>.
The marketplace is an index; a PR adds one entry to `.grok-plugin/marketplace.json`
in that repo.

1. Fork `xai-org/plugin-marketplace`, branch from `main`.
2. Get the pinned commit: `git ls-remote https://github.com/vumpt/bloggity-mcp HEAD`
   (full 40-char SHA; branches, tags and short SHAs are rejected).
3. Add the entry from `docs/grok-marketplace-entry.json`, filling in `sha`.
4. Run `scripts/generate-plugin-index.py`, then `scripts/validate-catalog.py` and
   `scripts/generate-plugin-index.py --check`. Commit the regenerated index.
5. Open the PR using their template.

Review tips from their guide: source from the official organization rather than a
personal account (move this repo to a Bloggity org before submitting), keep the
pinned commit reachable, request only the MCP access needed, avoid generic
keywords, and declare network endpoints and credentials in the README (done).
Security review rejects remote code execution, exfiltration, broad hooks,
obfuscation, and prompt injection; this plugin ships only a skill and a remote
HTTP MCP config.

## Claude Code

`/plugin marketplace add vumpt/bloggity-mcp` then `/plugin install bloggity@bloggity`.
