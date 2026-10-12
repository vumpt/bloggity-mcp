# Bloggity MCP server

Public interface of the hosted Bloggity MCP server that this repo's plugins
connect to. This repo contains client-side connectors only; it holds no
Bloggity backend or frontend code.

## Endpoints

| Purpose | URL |
|---|---|
| MCP (Streamable HTTP, JSON responses) | `https://mcp.bloggity.io/mcp` |
| Protected-resource metadata (RFC 9728) | `https://mcp.bloggity.io/.well-known/oauth-protected-resource/mcp` |
| OAuth authorization server | `https://backend.bloggity.io` |
| Health | `https://mcp.bloggity.io/health` |


## Protocol behaviour

- JSON-RPC 2.0: `initialize`, `notifications/initialized`, `tools/list`,
  `tools/call`; batches supported. `GET /mcp` returns 405 (no SSE).
- `initialize` and `tools/list` are open, so clients can discover tools before
  sign-in. `tools/call` requires a Bearer token; failures return a transport-level
  `401`/`403` with `WWW-Authenticate` pointing at the protected-resource metadata.
- `tools/list` always returns the full catalogue; each tool declares its OAuth
  requirement in `securitySchemes`.

## Authentication

OAuth 2.1 with PKCE (S256), RFC 8707 resource indicators, and either Dynamic
Client Registration or Client ID Metadata Documents (hosts allowed:
`claude.ai`, `claude.com`, `anthropic.com`, `chatgpt.com`, `openai.com`).
Access tokens are JWTs with `aud` = `https://mcp.bloggity.io/mcp`.

Scopes: `openid`, `profile`, `email`, `offline_access`, `blog.read`, `blog.write`.

Users can revoke any client under
**Connected Apps** in the Bloggity dashboard; revocation takes effect immediately.

## Tools

Every tool calls the same service as its dashboard route.

| Tool | Scope | Description |
|---|---|---|
| `whoami` | token only | Stable user id, name, email, nickname. Call first to trigger sign-in |
| `list_products` | `blog.read` | List the user's blogs/products |
| `list_todos` | `blog.read` | Tasks screen: topic tasks, keyword suggestions, research suggestions per product. Optional `productId` |
| `list_research_topics` | `blog.read` | Research Tasks for a product. Requires `productId` |
| `schedule_todo` | `blog.write` | Schedule a topic. `topicId`; optional `date`, `generate` (default false) |
| `set_todo_status` | `blog.write` | `topicId` + `action`: `snooze`, `backlog`, `restore` |
| `accept_keyword_suggestions` | `blog.write` | Promote suggested (and optional manual) keywords |
| `defer_keyword_suggestions` | `blog.write` | Defer a product's keyword suggestions until tomorrow |
| `accept_research_topic` | `blog.write` | Accept a proposed Research Task, optionally scheduling it |
| `schedule_research_topic` | `blog.write` | Schedule a Research Task (`id`, `date`) |
| `cancel_research_topic` | `blog.write` | Cancel a scheduled Research Task |
| `dismiss_research_topic` | `blog.write` | Decline proposals (empty ids = all pending) |
| `backlog_research_topic` | `blog.write` | Send proposals to the research backlog (~7 days) |

Manual post writing is deliberately not exposed over MCP.

## Data handling

- Requests go only to `mcp.bloggity.io` (tools) and `backend.bloggity.io` (OAuth).
- Every query is scoped to the authenticated user's team; a token can only touch
  that team's data.
- The optional `X-Source-Name` header (`claude-plugin`, `cursor-plugin`, ...)
  identifies which connector made the request. No other client data is sent.
- Tokens are never logged.
