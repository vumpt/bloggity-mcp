# Agent instructions

This repo is the **public, customer-facing** connector for Bloggity: plugin
manifests, MCP client configs, one skill, and user documentation. It is
published to third-party marketplaces.

## Scope rules

- Document and reference **only** the public MCP tools listed in `tools.json`,
  as the hosted server exposes them. Do not mention, imply, or add tools,
  endpoints, or behaviours that are not in that list.
- Do **not** add Bloggity backend, frontend, database, infrastructure, or
  deployment details: no source code, internal file paths, schema, process
  layout, environment variables, hostnames beyond the public MCP/OAuth URLs,
  security gaps, or roadmap. If you are unsure whether something is public,
  leave it out and ask.
- Do not copy code or docs from the private product repo into this one.
- Describe tools from the user's point of view (what they do for the customer),
  not how they are implemented.
- Changes to the tool surface happen in the hosted server first; then update
  `tools.json`, `docs/server.md`, and the skill together.

Run `node scripts/validate.mjs` before committing.
