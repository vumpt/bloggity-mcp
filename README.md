# Bloggity plugin

Manage your [Bloggity](https://bloggity.io) blog from your coding agent. Bloggity plans and publishes SEO blog posts; this plugin connects Claude Code, Cursor, Codex, Grok and any other MCP client to the hosted Bloggity MCP server, so you can review the Tasks queue, schedule posts, accept keyword suggestions and run Research Tasks without leaving your editor.

MCP server: `https://mcp.bloggity.io/mcp` (OAuth 2.1, browser sign-in on first use).

## What you get

- The `bloggity` MCP server with 13 tools (see [docs/server.md](docs/server.md)).
- The `bloggity` skill, which teaches the agent the Tasks workflow and its safety rules (for example, never spending a generation credit without asking).

## Scope

This repo and plugin are for public, customer-facing use of Bloggity through its documented MCP tools (listed in [`tools.json`](tools.json)). Agents are instructed (see [`AGENTS.md`](AGENTS.md) and the skill) not to describe or probe Bloggity internals.

## Install

### Claude Code

```
/plugin marketplace add vumpt/bloggity-mcp
/plugin install bloggity@bloggity
```

Then run `/mcp`, select `bloggity`, and complete browser sign-in. If you added the server by hand before, remove it first to avoid two connections.

### Cursor

Marketplace listing is pending review. Until then, add the server to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "bloggity": {
      "type": "http",
      "url": "https://mcp.bloggity.io/mcp",
      "headers": { "X-Source-Name": "cursor-plugin" }
    }
  }
}
```

Or install this repo as a local plugin (`.cursor-plugin/plugin.json`).

### Grok

```
grok plugin install https://github.com/vumpt/bloggity-mcp
```

Marketplace listing is pending; see [docs/marketplaces.md](docs/marketplaces.md). Complete OAuth on first use.

### Codex

```
codex mcp add bloggity --url https://mcp.bloggity.io/mcp
codex mcp login bloggity
```

### Claude.ai, Cowork and ChatGPT

Add a custom connector pointing at `https://mcp.bloggity.io/mcp` and sign in through the browser.

### Any MCP client (no plugin)

Add an HTTP server with URL `https://mcp.bloggity.io/mcp`. Claude Code example:

```
claude mcp add --transport http bloggity https://mcp.bloggity.io/mcp
```

### Skill only

Copy `skills/bloggity/` into your agent's skills directory and add the MCP server by hand.

## Data handling

Requests go to `mcp.bloggity.io` (tool calls) and `backend.bloggity.io` (OAuth). The only extra header is `X-Source-Name`, naming the connector. Tokens are not logged. Every call is scoped to the signed-in user's team.

## Authentication

OAuth 2.1 with PKCE and dynamic client registration. Scopes: `blog.read` for listing, `blog.write` for scheduling and accepting suggestions. Revoke any client under **Connected Apps** in the Bloggity dashboard; access ends immediately.

## Safety

- Post bodies cannot be written over MCP; only the Tasks queue, keywords and Research Tasks.
- `schedule_todo` does not generate a post unless `generate: true` is passed.

## Repository layout

| Path | Consumed by |
|---|---|
| `.cursor-plugin/` | Cursor |
| `.claude-plugin/` | Claude Code plugin and marketplace |
| `.codex-plugin/` | Codex |
| `.grok-plugin/` | Grok Build |
| `.mcp.json` | Generic MCP config (Grok at root) |
| `agents/<client>/` | Per-client MCP server config |
| `skills/bloggity/` | Canonical Agent Skill |
| `assets/` | Logo |
| `docs/` | Server reference, marketplace submission guides |
| `scripts/validate.mjs` | Manifest validator |

This repo contains no Bloggity backend or frontend code; [docs/server.md](docs/server.md) documents the public interface only.

## Development

```
node scripts/validate.mjs
```

Keep `version` identical across all `*-plugin/plugin.json` files. Submission steps per marketplace are in [docs/marketplaces.md](docs/marketplaces.md).

## License

MIT (set in each manifest). Confirm before publishing.
