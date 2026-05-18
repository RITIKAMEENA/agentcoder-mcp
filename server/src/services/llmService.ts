import "dotenv/config";

type Provider = "gemini" | "openai" | "mock";

const provider = (process.env.AI_PROVIDER || "mock") as Provider;

export async function askAI(prompt: string): Promise<string> {
  if (provider === "gemini" && process.env.GEMINI_API_KEY) return askGemini(prompt);
  if (provider === "openai" && process.env.OPENAI_API_KEY) return askOpenAI(prompt);
  return mockResponse(prompt);
}

async function askGemini(prompt: string): Promise<string> {
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });
  if (!res.ok) throw new Error(`Gemini API error: ${res.status} ${await res.text()}`);
  const data = await res.json() as any;
  return data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("\n") || "No Gemini response.";
}

async function askOpenAI(prompt: string): Promise<string> {
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], temperature: 0.2 })
  });
  if (!res.ok) throw new Error(`OpenAI API error: ${res.status} ${await res.text()}`);
  const data = await res.json() as any;
  return data?.choices?.[0]?.message?.content || "No OpenAI response.";
}

function mockResponse(prompt: string): string {
  return `MOCK MODE RESPONSE\n\nSet AI_PROVIDER=gemini/openai and add API key in .env for real output.\n\nPrompt preview:\n${prompt.slice(0, 900)}...`;
}
