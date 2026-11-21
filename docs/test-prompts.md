# Test prompts

Prompts with expected results, for directory submissions (the ChatGPT review
asks for test prompts with expected responses; the Claude directory asks for
at least three working examples). Run them against the reviewer account.

| # | Prompt | Expected tools | Expected result |
|---|---|---|---|
| 1 | "Which Bloggity account am I connected to?" | `whoami` | Account name and email, plan, credits left, and each blog's publish time. |
| 2 | "What's on my blog schedule for the next two weeks?" | `list_products`, `list_schedule` | One line per scheduled day: date, post or research, title, and whether it can move. |
| 3 | "Show my Tasks queue." | `list_todos` | The open TODOs, each with the actions it offers (schedule, snooze, backlog, accept, defer, dismiss). Nothing changes. |
| 4 | "Schedule the first topic on the next open day." | `list_todos`, `schedule_todo` | The assistant names the topic and day, asks for a yes, then schedules it and reports the date. |
| 5 | "Move the post on <date> to <date>." | `list_schedule`, `move_scheduled_item` | The post moves; if the target day is taken, the assistant asks before it swaps. |
| 6 | "Which posts got the most visits in the last 30 days?" | `rank_posts` | A ranked list of posts with visits; low-confidence data is called out. |
| 7 | "How is my blog doing overall?" | `get_analytics` | Visits, top pages and the trend for the period. |
| 8 | "What keywords am I targeting?" | `list_keywords` | Active keywords with volume and difficulty; on Free, the locked count and an upgrade note. |
| 9 | "Accept the suggested keywords." | `list_todos`, `accept_keyword_suggestions` | The assistant states the credit cost, asks for a yes, then adds the keywords. |
| 10 | "Any new notifications?" | `list_notifications` | Newest notifications with links; nothing is marked read unless asked. |
