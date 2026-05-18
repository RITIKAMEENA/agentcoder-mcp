export type Language = string;

const baseRules = `Return a clean, structured answer. Be practical, specific, and avoid unnecessary theory. If you provide code, use fenced code blocks.`;

export function reviewPrompt(code: string, language: Language) {
  return `${baseRules}\n\nReview this ${language} code. Include:\n1. Bugs or risky logic\n2. Time complexity\n3. Space complexity\n4. Security issues\n5. Clean code improvements\n6. Final corrected suggestions\n\nCode:\n\n\`\`\`${language}\n${code}\n\`\`\``;
}

export function fixBugPrompt(code: string, language: Language, errorMessage?: string) {
  return `${baseRules}\n\nFix this ${language} code. Explain the root cause shortly, then provide corrected code.\n${errorMessage ? `Error message:\n${errorMessage}\n` : ""}\nCode:\n\n\`\`\`${language}\n${code}\n\`\`\``;
}

export function optimizePrompt(code: string, language: Language, goal?: string) {
  return `${baseRules}\n\nOptimize this ${language} code${goal ? ` for ${goal}` : ""}. Include improved complexity and optimized code.\n\nCode:\n\n\`\`\`${language}\n${code}\n\`\`\``;
}

export function testsPrompt(code: string, language: Language, framework?: string) {
  return `${baseRules}\n\nGenerate unit tests for this ${language} code. Use ${framework || "the most suitable testing framework"}. Include edge cases.\n\nCode:\n\n\`\`\`${language}\n${code}\n\`\`\``;
}

export function explainPrompt(code: string, language: Language) {
  return `${baseRules}\n\nExplain this ${language} code in simple Hinglish/English. Include main idea, flow, and complexity.\n\nCode:\n\n\`\`\`${language}\n${code}\n\`\`\``;
}

export function convertPrompt(code: string, fromLanguage: string, toLanguage: string) {
  return `${baseRules}\n\nConvert this code from ${fromLanguage} to ${toLanguage}. Preserve logic and add small comments.\n\nCode:\n\n\`\`\`${fromLanguage}\n${code}\n\`\`\``;
}

export function commitPrompt(diffOrSummary: string) {
  return `${baseRules}\n\nGenerate a professional Git commit message from this diff/summary. Return:\n1. Conventional commit title\n2. 2-4 bullet body\n\nInput:\n${diffOrSummary}`;
}

export function docsPrompt(code: string, language: Language) {
  return `${baseRules}\n\nGenerate useful documentation/comments for this ${language} code. Include function-level explanation and usage notes.\n\nCode:\n\n\`\`\`${language}\n${code}\n\`\`\``;
}

export function securityPrompt(code: string, language: Language) {
  return `${baseRules}\n\nAnalyze this ${language} code for security issues. Include severity, issue, impact, and fix.\n\nCode:\n\n\`\`\`${language}\n${code}\n\`\`\``;
}
