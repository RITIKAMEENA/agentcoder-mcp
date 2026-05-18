# AgentCoder MCP — AI Coding Assistant Server

A modern MCP project that works like a mini Cursor/Copilot backend. It exposes AI coding tools through Model Context Protocol and includes optional GitHub integration, MongoDB history, Docker setup, and a React showcase dashboard.

## Features

- `review_code` — code quality, bugs, complexity, clean-code suggestions
- `fix_bug` — fixes code using error message/context
- `optimize_code` — improves time/space complexity
- `generate_tests` — generates Jest/pytest/JUnit-style tests
- `explain_code` — explains code in simple language
- `convert_language` — converts code between languages
- `generate_commit_message` — creates conventional commit messages
- `generate_documentation` — adds documentation/comments
- `detect_security_issues` — checks vulnerability risks
- `github_review_file` — fetches and reviews a GitHub file
- `github_list_files` — lists repository files
- `history_recent` — returns recent tool calls from MongoDB

## Tech Stack

- TypeScript + Node.js
- MCP TypeScript SDK
- Zod v3 validation
- Gemini API / OpenAI API / Mock mode
- MongoDB for history
- GitHub REST API via Octokit
- Docker + docker-compose
- React + Vite dashboard

## Project Structure

```text
agentcoder-mcp-pro/
├── server/
│   ├── src/
│   │   ├── index.ts
│   │   ├── tools/aiTools.ts
│   │   ├── services/llmService.ts
│   │   ├── services/codeAnalyzer.ts
│   │   ├── services/githubService.ts
│   │   ├── storage/history.ts
│   │   └── utils/prompts.ts
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── dashboard/
│   └── React showcase UI
├── .cursor/mcp.json
├── docker-compose.yml
└── examples/tool-inputs.json
```

## Run Server Locally

```bash
cd server
npm install
copy .env.example .env
npm run dev
```

For Mac/Linux:

```bash
cp .env.example .env
npm run dev
```

By default, it can run in mock mode if no API key is provided. For real AI output, set:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key
```

or:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_key
```

## Build

```bash
cd server
npm run build
npm start
```

## Cursor MCP Setup

1. Build server:

```bash
cd server
npm run build
```

2. Open `.cursor/mcp.json`.
3. Replace `/ABSOLUTE/PATH/TO/agentcoder-mcp-pro/server/dist/index.js` with your real absolute path.
4. Add your API key.
5. Restart Cursor.
6. Ask Cursor to use AgentCoder MCP tools like `review_code` or `fix_bug`.

Example Windows path:

```json
"args": ["C:/Users/meena/Downloads/agentcoder-mcp-pro/server/dist/index.js"]
```

## Docker

```bash
docker compose up --build
```

MongoDB will run on `localhost:27017`.

## Dashboard

The dashboard is a resume/GitHub showcase UI. MCP servers usually communicate over stdio with Cursor/Claude, so this dashboard is intentionally not directly wired to stdio. You can later add an HTTP wrapper if you want a web playground.

```bash
cd dashboard
npm install
npm run dev
```

## GitHub Integration

Add token in `server/.env`:

```env
GITHUB_TOKEN=github_pat_xxx
```

Then use MCP tools:

```json
{
  "owner": "yourGitHubUsername",
  "repo": "yourRepo",
  "path": "src/index.ts"
}
```

## Resume Bullet

Built AgentCoder MCP, an AI coding assistant server exposing MCP tools for code review, bug fixing, optimization, test generation, GitHub file analysis, security scanning, and MongoDB-backed history using TypeScript, Node.js, MCP SDK, Gemini/OpenAI APIs, Docker, and React.

## What You Still Need To Do

- Add your API keys in `.env`
- Run `npm install`
- Build and test in Cursor/Claude
- Upload to GitHub with screenshots
- Optionally connect dashboard to an HTTP wrapper

