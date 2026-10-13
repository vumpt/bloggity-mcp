# Bloggity MCP server

Public interface of the hosted Bloggity MCP server that this repo's plugins
connect to. This repo contains client-side connectors only; it holds no
Bloggity backend or frontend code.

## Endpoints

| Purpose | URL |
|---|---|
| MCP (Streamable HTTP, JSON responses) | `https://mcp.bloggity.io/mcp` |
| OAuth authorization server | `https://backend.bloggity.io` |
| Health | `https://mcp.bloggity.io/health` |


## Connecting

- Streamable HTTP; add the server URL to any MCP client that supports remote
  servers.
- Tool discovery works before sign-in. Calling a tool requires signing in, and
  your client will prompt you through the browser.

## Authentication

OAuth 2.1 with PKCE; sign in with your Bloggity account in the browser.

Scopes: `blog.read` (listing) and `blog.write` (scheduling and accepting
suggestions).

You can revoke any connected client under
**Connected Apps** at `https://backend.bloggity.io/connected-apps` (signed in with your Bloggity account); revocation takes effect immediately.

## Tools

Each tool mirrors an action available in the Bloggity dashboard.

| Tool | Scope | Description |
|---|---|---|
| `whoami` | token only | Stable user id, name, email, nickname, plus `plan`, `credits`, `monthlyCredits`, `nextResetAt`. Call first to trigger sign-in |
| `list_products` | `blog.read` | List the user's blogs/products |
| `list_todos` | `blog.read` | The Tasks screen, in the same priority order: topics to schedule, a keyword card when a product is running low on topics (hidden while deferred), and research suggestions awaiting a decision. Optional `productId` |
| `list_research_topics` | `blog.read` | Research Tasks for a product. Requires `productId` |
| `schedule_todo` | `blog.write` | Schedule a topic. `topicId`; optional `date`, `generate` (default false). Returns `out_of_credits` |
| `set_todo_status` | `blog.write` | `topicId` + `action`: `snooze`, `backlog`, `restore` |
| `accept_keyword_suggestions` | `blog.write` | Promote suggested (and optional manual) keywords |
| `defer_keyword_suggestions` | `blog.write` | Defer a product's keyword suggestions until tomorrow |
| `accept_research_topic` | `blog.write` | Accept a proposed Research Task, optionally scheduling it |
| `schedule_research_topic` | `blog.write` | Schedule a Research Task (`id`, `date`). Returns `out_of_credits` |
| `cancel_research_topic` | `blog.write` | Cancel a scheduled Research Task |
| `dismiss_research_topic` | `blog.write` | Decline proposals (empty ids = all pending) |
| `backlog_research_topic` | `blog.write` | Send proposals to the research backlog (~7 days) |

Manual post writing is deliberately not exposed over MCP.

## Data handling

- Requests go only to `mcp.bloggity.io` (tools) and `backend.bloggity.io` (OAuth).
- Every query is scoped to the authenticated user's team; a token can only touch
  that team's data.
- The optional `X-Source-Name` header (`claude-plugin`, `cursor-plugin`, ...)
  names the connector for identification only; it does not affect access. No other client data is sent.
- Tokens are never logged.
