#!/usr/bin/env node
import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { convertLanguage, detectSecurityIssues, explainCode, fixBug, generateCommitMessage, generateDocumentation, generateTests, optimizeCode, reviewCode } from "./tools/aiTools.js";
import { getRepoFile, listRepoFiles } from "./services/githubService.js";
import { getRecentHistory } from "./storage/history.js";

const server = new McpServer({ name: "AgentCoder MCP", version: "1.0.0" });

function text(content: string) {
  return { content: [{ type: "text" as const, text: content }] };
}

server.tool("review_code", { code: z.string(), language: z.string().default("typescript") }, async ({ code, language }) => text(await reviewCode(code, language)));
server.tool("fix_bug", { code: z.string(), language: z.string().default("typescript"), errorMessage: z.string().optional() }, async ({ code, language, errorMessage }) => text(await fixBug(code, language, errorMessage)));
server.tool("optimize_code", { code: z.string(), language: z.string().default("typescript"), goal: z.string().optional() }, async ({ code, language, goal }) => text(await optimizeCode(code, language, goal)));
server.tool("generate_tests", { code: z.string(), language: z.string().default("typescript"), framework: z.string().optional() }, async ({ code, language, framework }) => text(await generateTests(code, language, framework)));
server.tool("explain_code", { code: z.string(), language: z.string().default("typescript") }, async ({ code, language }) => text(await explainCode(code, language)));
server.tool("convert_language", { code: z.string(), fromLanguage: z.string(), toLanguage: z.string() }, async ({ code, fromLanguage, toLanguage }) => text(await convertLanguage(code, fromLanguage, toLanguage)));
server.tool("generate_commit_message", { diffOrSummary: z.string() }, async ({ diffOrSummary }) => text(await generateCommitMessage(diffOrSummary)));
server.tool("generate_documentation", { code: z.string(), language: z.string().default("typescript") }, async ({ code, language }) => text(await generateDocumentation(code, language)));
server.tool("detect_security_issues", { code: z.string(), language: z.string().default("typescript") }, async ({ code, language }) => text(await detectSecurityIssues(code, language)));

server.tool("github_review_file", {
  owner: z.string(), repo: z.string(), path: z.string(), ref: z.string().optional(), language: z.string().optional()
}, async ({ owner, repo, path, ref, language }) => {
  const code = await getRepoFile(owner, repo, path, ref);
  const lang = language || path.split(".").pop() || "text";
  return text(await reviewCode(code, lang));
});

server.tool("github_list_files", { owner: z.string(), repo: z.string(), path: z.string().default(""), ref: z.string().optional() }, async ({ owner, repo, path, ref }) => {
  const files = await listRepoFiles(owner, repo, path, ref);
  return text(files.join("\n"));
});

server.tool("history_recent", { limit: z.number().min(1).max(50).default(10) }, async ({ limit }) => {
  const rows = await getRecentHistory(limit);
  return text(JSON.stringify(rows, null, 2));
});

const transport = new StdioServerTransport();
await server.connect(transport);
