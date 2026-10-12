# Bloggity plugin

Manage your [Bloggity](https://bloggity.io) blog from your coding agent. Bloggity plans and publishes SEO blog posts; this plugin connects Claude Code, Cursor, Codex, Grok and any other MCP client to the hosted Bloggity MCP server, so you can review the Tasks queue, schedule posts, accept keyword suggestions and run Research Tasks without leaving your editor.

MCP server: `https://mcp.bloggity.io/mcp` (OAuth 2.1, browser sign-in on first use).

## What you get

- The `bloggity` MCP server with 13 tools (see [docs/server.md](docs/server.md)).
- The `bloggity` skill, which teaches the agent the Tasks workflow and its safety rules (for example, never spending a generation credit without asking).

## Scope

This repo and plugin are for public, customer-facing use of Bloggity through its documented MCP tools (listed in [`tools.json`](tools.json)). Agents are instructed (see [`AGENTS.md`](AGENTS.md) and the skill) not to describe or probe Bloggity internals.

## Set up with your agent

Copy this prompt into your coding agent (Claude Code, Cursor, Codex, Grok or any MCP-capable agent) and it will set Bloggity up for you:

```text
Set up the Bloggity MCP server for me.

1. Add a remote (HTTP) MCP server named "bloggity" with URL
   https://mcp.bloggity.io/mcp using whatever method this client supports
   (its MCP config file or its "mcp add" command). It uses OAuth, so do not
   ask me for an API key or token.
2. Tell me the exact change you are about to make and which file or setting it
   touches, and wait for my OK before writing anything.
3. After it is added, tell me if I need to restart the client or sign in via
   my browser, then call the "whoami" tool to confirm the connected account.
4. Optionally, if this client supports skills, offer to copy the skill from
   https://github.com/vumpt/bloggity-mcp/blob/main/skills/bloggity/SKILL.md
   into my skills directory. Show me the file first.

Only use the URL above. Do not run downloaded scripts or install anything else.
```

## Install

Marketplace listings (Claude Code, Cursor, Codex, Grok) are **not published yet**. Until they are, connect Bloggity as a standard remote MCP server. It works in any MCP client that supports HTTP servers with OAuth.

**Server URL:** `https://mcp.bloggity.io/mcp` (transport: Streamable HTTP; auth: OAuth, browser sign-in on first use)

Generic config (most clients accept this shape):

```json
{
  "mcpServers": {
    "bloggity": {
      "type": "http",
      "url": "https://mcp.bloggity.io/mcp"
    }
  }
}
```

Client-specific shortcuts:

```
# Claude Code
claude mcp add --transport http bloggity https://mcp.bloggity.io/mcp

# Codex
codex mcp add bloggity --url https://mcp.bloggity.io/mcp
```

- **Cursor:** add the generic config (without `type`) to `~/.cursor/mcp.json` or the project's `.cursor/mcp.json`.
- **Claude.ai, Cowork, ChatGPT:** add a custom connector with the server URL and sign in through the browser.
- **Other clients:** use the client's "add remote/HTTP MCP server" option with the URL above.

After connecting, ask the agent to run `whoami` to trigger sign-in and confirm the account.

### Optional: the skill

`skills/bloggity/SKILL.md` teaches the agent the Tasks workflow and its safety rules. Copy the `skills/bloggity/` folder into your agent's skills directory (for example `.claude/skills/` or `.agents/skills/`).

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
| `.claude-plugin/` | Claude Code plugin manifest and marketplace |
| `.cursor-plugin/` | Cursor plugin manifest |
| `.codex-plugin/`, `.agents/plugins/` | Codex plugin manifest and marketplace |
| `.grok-plugin/` | Grok Build plugin manifest |
| `.mcp.json` | MCP config read by Claude Code and Grok Build |
| `mcp.json` | MCP config read by Cursor |
| `agents/codex/.mcp.json` | MCP config referenced by the Codex manifest |
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
