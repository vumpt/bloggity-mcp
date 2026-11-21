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


## Tool annotations

Every tool has a `title` and the MCP behaviour hints `readOnlyHint`,
`destructiveHint`, `idempotentHint` and `openWorldHint`. Clients use them to
decide which calls need a confirmation:

- Read tools are read-only. `get_search_analysis` is not, because a repeat
  analysis costs 1 credit.
- `archive_post`, `archive_keyword`, `cancel_research_topic` and
  `dismiss_research_topic` are marked destructive, though each can be undone
  in the dashboard.
- `openWorldHint` is false for every tool: each one works only inside your
  own Bloggity account.

A tool that fails returns an error result with a message you can act on.

## Connecting

- Streamable HTTP; add the server URL to any MCP client that supports remote
  servers.
- Tool discovery works before sign-in. Calling a tool requires signing in, and
  your client will prompt you through the browser.

## Authentication

OAuth 2.1 with PKCE; sign in with your Bloggity account in the browser.

Scopes: `blog.read` (listing, posts, keywords, search analyses, authors, calendar,
notifications and traffic reports) and `blog.write` (scheduling, moving,
accepting suggestions, adding and archiving keywords, archiving posts, authors
and marking notifications read).

You can revoke any connected client under
**Connected Apps** at `https://backend.bloggity.io/connected-apps` (signed in with your Bloggity account); revocation takes effect immediately.

## Tools

Each tool mirrors an action available in the Bloggity dashboard.

| Tool | Scope | Description |
|---|---|---|
| `whoami` | token only | Stable user id, name, email, nickname, plus `plan`, `credits` (1 credit per written post, per Research Task, per keyword added from the keyword card, and per repeat search analysis), `monthlyCredits`, `nextResetAt`, and `publishTimes` (for each product, the time of day in UTC that scheduled posts go live). Call first to trigger sign-in |
| `list_products` | `blog.read` | List the user's blogs/products |
| `list_todos` | `blog.read` | The Tasks screen, in the same priority order: topics to schedule, a keyword card when a product is running low on topics (hidden while deferred), an upgrade card when the plan has locked keywords (Free), research suggestions awaiting a decision, and suggested posts drafted from research the user marked important (`suggested_topic`, with the reason). Optional `productId` |
| `list_research_topics` | `blog.read` | Research Tasks for a product. Requires `productId` |
| `list_schedule` | `blog.read` | The calendar for a product: every taken day between two dates with its kind (post or research), title, ids (`topicId`, `postId`, `researchTaskId`), and whether it can be moved. Days not listed are open. Optional `productId`, `from`, `to` (default today through 30 days ahead, up to 120 days) |
| `move_scheduled_item` | `blog.write` | Move the post or Research Task scheduled on `fromDate` to `toDate`. If `toDate` is taken, nothing changes unless `swap: true`, which trades the two days. A post's publish date moves with it. Past days, posts being written or already published, and running or finished research cannot be moved. Optional `productId` |
| `swap_scheduled` | `blog.write` | Swap the scheduled days of two items. `a` and `b` are each a topic id, post id or Research Task id from `list_schedule`, `list_todos` or `list_research_topics`; both must already be scheduled. The same rules apply as for `move_scheduled_item`. Optional `productId` |
| `schedule_todo` | `blog.write` | Schedule a topic. `topicId`; optional `date`, `generate` (default false). Posts are written in calendar order, on the day before they publish, once earlier research has finished. `generate: true` starts writing now only when that is already allowed (1 credit). Returns `generating` (whether writing started now) and `out_of_credits` |
| `set_todo_status` | `blog.write` | `topicId` + `action`: `snooze`, `backlog`, `restore` |
| `accept_keyword_suggestions` | `blog.write` | Promote suggested (and optional manual) keywords. Costs 1 credit per keyword added, all or nothing: with too few credits nothing is added and an error gives the shortfall. A Free plan includes one keyword: this returns an error saying so |
| `defer_keyword_suggestions` | `blog.write` | Defer a product's keyword suggestions until tomorrow |
| `accept_research_topic` | `blog.write` | Accept a proposed Research Task, optionally scheduling it |
| `schedule_research_topic` | `blog.write` | Schedule a Research Task (`id`, `date`). Returns `out_of_credits` |
| `cancel_research_topic` | `blog.write` | Cancel a scheduled Research Task |
| `dismiss_research_topic` | `blog.write` | Decline proposals (empty ids = all pending) |
| `backlog_research_topic` | `blog.write` | Send proposals to the research backlog (~7 days) |
| `get_analytics` | `blog.read` | Traffic for a product, as on the dashboard Analytics page: visitors, pageviews, visits, average time on page, bounce rate, change vs the previous period, top pages and where readers came from. `productId`; optional `range` (`7d`, `30d`, `90d`; default `30d`) |
| `get_post_traffic` | `blog.read` | Traffic for one post over a range, with the post's age. `postId`; optional `range` |
| `rank_posts` | `blog.read` | A product's published posts ranked by clicks, with age and clicks per day. `productId`; optional `range`. Visitors and time on page are included for the best and worst posts only |
| `list_posts` | `blog.read` | A product's posts, newest first: state, publish date, age, word count, by-line. `productId`; optional `state`, `archived` (list archived posts instead), `limit` |
| `get_post` | `blog.read` | One post in full, with its markdown body. `postId` |
| `archive_post` | `blog.write` | Take a written or published post off the calendar (and off the blog if it is live). Nothing is deleted; it can be given a day again in the dashboard. `postId` |
| `set_post_author` | `blog.write` | Change a post's by-line to an author from `list_authors`, or to the product name (`authorId: null`). `postId`, `authorId` |
| `list_keywords` | `blog.read` | A product's active keywords with search volume, difficulty, intent, analysis status and topics; plus locked and archived keywords and whether the plan can add keywords. `productId` |
| `add_keyword` | `blog.write` | Add a keyword the user typed (no credit charge). Optional `writeAboutThis` puts its posts first. A Free plan returns `plan_limit`. `productId`, `keyword` |
| `archive_keyword` | `blog.write` | Make a keyword inactive (`archived: true`, default) or restore it (`archived: false`). Nothing is deleted. `keywordId` |
| `get_search_analysis` | `blog.read` | The Search page for a keyword: its searches, whether Google's AI Overview cites or names the product, the brands and sites Google shows, the AI Overview's claims and the gaps a post must close. `productId` and `analysisId` or `keywordId` |
| `list_authors` | `blog.read` | A product's authors and its author mode (`product`, `fixed`, `rotate`, `random`). `productId` |
| `add_author` | `blog.write` | Add an author. `productId`, `name`; optional `bio` |
| `set_author_mode` | `blog.write` | Set how new posts get their by-line. `productId`, `authorMode`; `defaultAuthorId` for `fixed` |
| `answer_topic_suggestion` | `blog.write` | Act on a suggested post: `accept` (returns a `topicId` to schedule), `backlog`, `snooze` or `dismiss`. `id`, `action` |
| `reorder_schedule` | `blog.write` | Rearrange several calendar items inside a date range in one step, all or nothing. `productId`, `from`, `to`, `moves` (`id` from `list_schedule`, new `date`) |
| `list_notifications` | `blog.read` | The account's notifications, newest first, each with a link to its result in the dashboard. Optional `unreadOnly`, `limit` |
| `mark_notifications_read` | `blog.write` | Mark the given notification `ids`, or all, as read |

Traffic tools return a `status`. Anything other than `ready` means traffic data
is not available for that blog right now; no numbers are returned. They also
return `sampleSize` and `lowConfidence`: when `lowConfidence` is true, the data
is too small to judge. A response can list `unavailableSections`, parts that
failed to load; treat those as unknown, not zero. "Clicks" are visits to a post
page counted by Bloggity's own tracking, not Google search clicks and not CTA
clicks. The traffic tools are rate limited per user; a limited call returns a
`retryAfterSec` value.

Writing or editing post text is deliberately not exposed over MCP.

## Data handling

- Requests go only to `mcp.bloggity.io` (tools) and `backend.bloggity.io` (OAuth).
- Every query is scoped to the authenticated user's team; a token can only touch
  that team's data.
- The optional `X-Source-Name` header (`claude-plugin`, `cursor-plugin`, ...)
  names the connector for identification only; it does not affect access. No other client data is sent.
- Tokens are never logged.
