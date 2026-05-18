import "dotenv/config";
import { MongoClient } from "mongodb";

let client: MongoClient | null = null;

async function getCollection() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;
  if (!client) client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "agentcoder");
  return db.collection("tool_history");
}

export async function saveHistory(tool: string, input: unknown, output: string) {
  try {
    const collection = await getCollection();
    if (!collection) return;
    await collection.insertOne({ tool, input, output, createdAt: new Date() });
  } catch {
    // History must never break MCP tool response.
  }
}

export async function getRecentHistory(limit = 10) {
  const collection = await getCollection();
  if (!collection) return [];
  return collection.find({}).sort({ createdAt: -1 }).limit(limit).toArray();
}
