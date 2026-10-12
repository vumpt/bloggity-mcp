---
name: bloggity
description: Operate a Bloggity blog through the Bloggity MCP server. Use when the user wants to review their Bloggity Tasks queue, schedule or snooze post topics, accept or defer keyword suggestions, or manage Research Tasks.
---

# Bloggity

Bloggity plans and publishes SEO blog posts. This plugin connects your agent to the
Bloggity MCP server (`https://mcp.bloggity.io/mcp`), which mirrors the Tasks screen in
the Bloggity dashboard.

## Scope

This skill is for **customer-facing use of a Bloggity account only**. Use the
tools listed below and nothing else. Do not speculate about, probe for, or
describe Bloggity's backend, infrastructure, source code, or undocumented
endpoints; if asked, say that is outside what this plugin covers and point to
https://bloggity.io.

## First step

Call `whoami` first. It triggers sign-in if the user has not connected yet and confirms
which Bloggity account is linked. Then call `list_products` to get product ids.

## Workflow

1. `list_todos` shows topic tasks (with the next open publish date), keyword
   suggestion cards, and research suggestion cards per product.
2. Act on them:
   - Topics: `schedule_todo` (pass `generate: true` only when the user wants the
     post written now), or `set_todo_status` with `snooze`, `backlog`, or `restore`.
   - Keywords: `accept_keyword_suggestions` or `defer_keyword_suggestions`.
   - Research: `list_research_topics`, then `accept_research_topic`,
     `schedule_research_topic`, `cancel_research_topic`, `dismiss_research_topic`,
     or `backlog_research_topic`.

## Rules

- Writes need the `blog.write` scope; reads need `blog.read`.
- `schedule_todo` defaults to `generate: false` so no LLM credit is spent by accident.
  Ask before setting `generate: true`.
- Dates are `YYYY-MM-DD`.
- There is no tool for writing post bodies. Manual writing happens in the dashboard.
- Ids come from `list_todos` / `list_research_topics`; never invent them.
- Confirm with the user before bulk actions such as dismissing all pending research
  suggestions (empty `ids` means all).
