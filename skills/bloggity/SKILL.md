---
name: bloggity
description: Operate a Bloggity blog through the Bloggity MCP server. Use whenever the user mentions Bloggity, their blog Tasks/TODOs, post topics, keyword suggestions, or Research Tasks. Required companion to the Bloggity MCP tools: it defines what to do after listing items.
---

# Bloggity

Bloggity plans and publishes SEO blog posts. The Bloggity MCP server
(`https://mcp.bloggity.io/mcp`) mirrors the Tasks screen in the Bloggity
dashboard. The tools return data; this skill defines the experience. **Listing
items is never the end of the task.** Every item can be acted on, and your job
is to offer those actions and carry out the user's choice.

## Scope

Customer-facing use of one Bloggity account only. Use the tools named here and
nothing else. Do not speculate about, probe, or describe Bloggity's backend,
infrastructure, source code, or undocumented endpoints; if asked, say that is
outside what this plugin covers and point to https://bloggity.io.

## Start

1. Call `whoami` first. It triggers sign-in if needed and confirms the account.
2. Call `list_products` if you need a product id. With several products, group
   everything by product and name the product on each item.

## The Tasks queue: always list, then offer actions

`list_todos` returns three kinds of items. Never dump them as a bare list.
Present each with its title and the key facts, then the actions available for
it, and end by asking what the user wants to do.

| Item kind | What it is | Actions to offer | Tool |
|---|---|---|---|
| `topic` | A post topic ready to schedule (shows `nextPublishDate`) | Schedule on the next open day (the date shown), schedule on a date the user picks, snooze until tomorrow, move to backlog | `schedule_todo`, `set_todo_status` (`snooze`, `backlog`) |
| `add_keywords` | A card of suggested keywords for a product | Accept all, accept selected ones, add their own keywords too, defer until tomorrow | `accept_keyword_suggestions`, `defer_keyword_suggestions` |
| `add_research` | A card of proposed Research Tasks | Accept (optionally scheduling on a date), dismiss, send to the research backlog | `accept_research_topic`, `dismiss_research_topic`, `backlog_research_topic` |

Good shape for a reply:

> You have 3 things to review for **Acme Blog**:
> 1. **Topic: "How to X"** (SEO score 72). Next open publish day is 14 Oct.
>    Schedule it, pick another date, snooze, or backlog?
> 2. **8 suggested keywords** (e.g. "foo", "bar"). Accept all, pick some, add
>    your own, or defer until tomorrow?
> 3. **2 research suggestions** ("...", "..."). Accept, dismiss, or backlog?
>
> Tell me what to do with each, or say "schedule all topics" and I'll confirm first.

Rules for the follow-up:

- Ask a concrete question that names the actions. Do not just say "let me know".
- Offer sensible shortcuts for several items, but confirm before applying one
  action to many items.
- After each action, report the result (for example the date it was scheduled
  on) and say what is still outstanding. Offer to continue through the rest.
- When the queue is empty, say so, and offer to check Research Tasks with
  `list_research_topics`.

## Research Tasks

`list_research_topics` (needs a product id) shows proposed, available, and
scheduled tasks. Offer actions by state:

- Proposed: accept (optionally with a date), dismiss, backlog.
- Available (accepted, unscheduled): schedule on a date (`schedule_research_topic`).
- Scheduled: cancel to free the day slot (`cancel_research_topic`), or reschedule
  by cancelling and scheduling again.

## Safety rules

- Reads need `blog.read`; changes need `blog.write`. If a write is refused for
  scope, tell the user they need to reconnect and grant write access.
- `schedule_todo` does not generate a post unless `generate: true`. Generation
  spends a credit, so ask first. Never set it on your own.
- Dates are `YYYY-MM-DD`. Use the `nextPublishDate` from the list when the user
  says "next available".
- `dismiss_research_topic` and `backlog_research_topic` with empty `ids` affect
  all pending suggestions. Only do that if the user clearly asked for all.
- Use ids exactly as returned by the list tools. Never invent them.
- Post bodies cannot be written over MCP; point users to the dashboard for that.
