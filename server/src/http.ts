import "dotenv/config";
import express from "express";
import cors from "cors";

import {
  convertLanguage,
  detectSecurityIssues,
  explainCode,
  fixBug,
  generateCommitMessage,
  generateDocumentation,
  generateTests,
  optimizeCode,
  reviewCode
} from "./tools/aiTools.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "AgentCoder HTTP API is running",
    provider: process.env.AI_PROVIDER || "mock"
  });
});

app.post("/api/run-tool", async (req, res) => {
  try {
    const {
      tool,
      code,
      language = "javascript",
      errorMessage,
      goal,
      framework,
      fromLanguage,
      toLanguage,
      diffOrSummary
    } = req.body;

    if (!tool) {
      return res.status(400).json({ error: "Tool is required" });
    }

    let output = "";

    switch (tool) {
      case "review_code":
        output = await reviewCode(code, language);
        break;

      case "fix_bug":
        output = await fixBug(code, language, errorMessage);
        break;

      case "optimize_code":
        output = await optimizeCode(code, language, goal);
        break;

      case "generate_tests":
        output = await generateTests(code, language, framework);
        break;

      case "explain_code":
        output = await explainCode(code, language);
        break;

      case "detect_security_issues":
        output = await detectSecurityIssues(code, language);
        break;

      case "convert_language":
        output = await convertLanguage(code, fromLanguage || language, toLanguage || "python");
        break;

      case "generate_commit_message":
        output = await generateCommitMessage(diffOrSummary || code);
        break;

      case "generate_documentation":
        output = await generateDocumentation(code, language);
        break;

      default:
        return res.status(400).json({ error: `Unknown tool: ${tool}` });
    }

    return res.json({ output });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Something went wrong"
    });
  }
});

const PORT = Number(process.env.PORT || 3000);

app.listen(PORT, () => {
  console.log(`AgentCoder HTTP API running on http://localhost:${PORT}`);
});