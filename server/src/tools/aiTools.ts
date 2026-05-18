import { askAI } from "../services/llmService.js";
import { basicCodeMetrics } from "../services/codeAnalyzer.js";
import { saveHistory } from "../storage/history.js";
import { commitPrompt, convertPrompt, docsPrompt, explainPrompt, fixBugPrompt, optimizePrompt, reviewPrompt, securityPrompt, testsPrompt } from "../utils/prompts.js";

async function run(tool: string, input: unknown, prompt: string) {
  const output = await askAI(prompt);
  await saveHistory(tool, input, output);
  return output;
}

export async function reviewCode(code: string, language: string) {
  const metrics = basicCodeMetrics(code);
  const ai = await run("review_code", { code, language, metrics }, `${reviewPrompt(code, language)}\n\nBasic static metrics:\n${JSON.stringify(metrics, null, 2)}`);
  return `Static Metrics:\n${JSON.stringify(metrics, null, 2)}\n\nAI Review:\n${ai}`;
}

export const fixBug = (code: string, language: string, errorMessage?: string) => run("fix_bug", { code, language, errorMessage }, fixBugPrompt(code, language, errorMessage));
export const optimizeCode = (code: string, language: string, goal?: string) => run("optimize_code", { code, language, goal }, optimizePrompt(code, language, goal));
export const generateTests = (code: string, language: string, framework?: string) => run("generate_tests", { code, language, framework }, testsPrompt(code, language, framework));
export const explainCode = (code: string, language: string) => run("explain_code", { code, language }, explainPrompt(code, language));
export const convertLanguage = (code: string, fromLanguage: string, toLanguage: string) => run("convert_language", { code, fromLanguage, toLanguage }, convertPrompt(code, fromLanguage, toLanguage));
export const generateCommitMessage = (diffOrSummary: string) => run("generate_commit_message", { diffOrSummary }, commitPrompt(diffOrSummary));
export const generateDocumentation = (code: string, language: string) => run("generate_documentation", { code, language }, docsPrompt(code, language));
export const detectSecurityIssues = (code: string, language: string) => run("detect_security_issues", { code, language }, securityPrompt(code, language));
