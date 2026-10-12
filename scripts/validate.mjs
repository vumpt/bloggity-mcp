#!/usr/bin/env node
// Validates the connector manifests share one identity and reference real files.
import { readFile, access } from "node:fs/promises";

const errors = [];
const kebab = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
const manifests = [".cursor-plugin", ".claude-plugin", ".codex-plugin", ".grok-plugin"];
const exists = (p) => access(p).then(() => true, () => false);

async function json(p) {
  try {
    return JSON.parse(await readFile(p, "utf8"));
  } catch (e) {
    errors.push(`${p}: ${e.code === "ENOENT" ? "missing" : e.message}`);
    return null;
  }
}

const versions = new Set();
for (const dir of manifests) {
  const m = await json(`${dir}/plugin.json`);
  if (!m) continue;
  if (!kebab.test(m.name ?? "")) errors.push(`${dir}: name must be kebab-case`);
  for (const k of ["version", "description", "homepage", "license"]) {
    if (!m[k]) errors.push(`${dir}: missing ${k}`);
  }
  versions.add(m.version);
  for (const k of ["skills", "mcpServers", "logo"]) {
    if (m[k] && !(await exists(m[k]))) errors.push(`${dir}: ${k} path not found: ${m[k]}`);
  }
}
if (versions.size > 1) errors.push(`versions differ across manifests: ${[...versions]}`);

const mcpFiles = [".mcp.json", "mcp.json", "agents/codex/.mcp.json"];
for (const f of mcpFiles) {
  const c = await json(f);
  if (c && !/^https:\/\//.test(c.mcpServers?.bloggity?.url ?? "")) errors.push(`${f}: bloggity url must be https`);
}

await json(".claude-plugin/marketplace.json");
await json(".agents/plugins/marketplace.json");
const grok = await json("docs/grok-marketplace-entry.json");
if (grok && (grok.source?.source !== "url" || !grok.source?.url)) errors.push("docs/grok-marketplace-entry.json: remote source must be {source:\"url\", url, sha}");
const codex = await json(".codex-plugin/plugin.json");
if (codex && !codex.interface?.displayName) errors.push(".codex-plugin: interface.displayName required");

const skill = await readFile("skills/bloggity/SKILL.md", "utf8").catch(() => "");
if (!/^---\nname: .+\ndescription: .+\n---\n/.test(skill)) errors.push("skills/bloggity/SKILL.md: bad frontmatter");

// Tool surface: docs and skill may only reference tools in tools.json.
const toolsFile = await json("tools.json");
const allow = new Set(toolsFile?.tools ?? []);
const kinds = new Set(toolsFile?.outputKinds ?? []);
const toolLike = /`([a-z]+(?:_[a-z]+)+)`/g;
for (const f of ["skills/bloggity/SKILL.md", "docs/server.md", "README.md"]) {
  const text = await readFile(f, "utf8").catch(() => "");
  for (const [, id] of text.matchAll(toolLike)) {
    if (!allow.has(id) && !kinds.has(id) && !["offline_access"].includes(id)) errors.push(`${f}: \`${id}\` is not in tools.json`);
  }
}
const server = await readFile("docs/server.md", "utf8").catch(() => "");
for (const t of allow) if (!server.includes(`\`${t}\``)) errors.push(`docs/server.md: tool ${t} not documented`);

if (errors.length) {
  console.error(errors.map((e) => `- ${e}`).join("\n"));
  process.exit(1);
}
console.log("OK");
