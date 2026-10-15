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

Scopes: `blog.read` (listing, calendar and traffic reports) and `blog.write` (scheduling, moving and accepting
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
| `list_schedule` | `blog.read` | The calendar for a product: every taken day between two dates with its kind (post or research), title, and whether it can be moved. Days not listed are open. Optional `productId`, `from`, `to` (default today through 30 days ahead, up to 120 days) |
| `move_scheduled_item` | `blog.write` | Move the post or Research Task scheduled on `fromDate` to `toDate`. If `toDate` is taken, nothing changes unless `swap: true`, which trades the two days. A post's publish date moves with it. Past days, posts being written or already published, and running or finished research cannot be moved. Optional `productId` |
| `schedule_todo` | `blog.write` | Schedule a topic. `topicId`; optional `date`, `generate` (default false). Returns `out_of_credits` |
| `set_todo_status` | `blog.write` | `topicId` + `action`: `snooze`, `backlog`, `restore` |
| `accept_keyword_suggestions` | `blog.write` | Promote suggested (and optional manual) keywords |
| `defer_keyword_suggestions` | `blog.write` | Defer a product's keyword suggestions until tomorrow |
| `accept_research_topic` | `blog.write` | Accept a proposed Research Task, optionally scheduling it |
| `schedule_research_topic` | `blog.write` | Schedule a Research Task (`id`, `date`). Returns `out_of_credits` |
| `cancel_research_topic` | `blog.write` | Cancel a scheduled Research Task |
| `dismiss_research_topic` | `blog.write` | Decline proposals (empty ids = all pending) |
| `backlog_research_topic` | `blog.write` | Send proposals to the research backlog (~7 days) |
| `get_analytics` | `blog.read` | Traffic for a product, as on the dashboard Analytics page: visitors, pageviews, visits, average time on page, bounce rate, change vs the previous period, top pages and where readers came from. `productId`; optional `range` (`7d`, `30d`, `90d`; default `30d`) |
| `get_post_traffic` | `blog.read` | Traffic for one post over a range, with the post's age. `postId`; optional `range` |
| `rank_posts` | `blog.read` | A product's published posts ranked by clicks, with age and clicks per day. `productId`; optional `range`. Visitors and time on page are included for the best and worst posts only |

Traffic tools return a `status`. Anything other than `ready` means traffic data
is not available for that blog right now; no numbers are returned. They also
return `sampleSize` and `lowConfidence`: when `lowConfidence` is true, the data
is too small to judge. A response can list `unavailableSections`, parts that
failed to load; treat those as unknown, not zero. "Clicks" are visits to a post
page counted by Bloggity's own tracking, not Google search clicks and not CTA
clicks. The traffic tools are rate limited per user; a limited call returns a
`retryAfterSec` value.

Manual post writing is deliberately not exposed over MCP.

## Data handling

- Requests go only to `mcp.bloggity.io` (tools) and `backend.bloggity.io` (OAuth).
- Every query is scoped to the authenticated user's team; a token can only touch
  that team's data.
- The optional `X-Source-Name` header (`claude-plugin`, `cursor-plugin`, ...)
  names the connector for identification only; it does not affect access. No other client data is sent.
- Tokens are never logged.
