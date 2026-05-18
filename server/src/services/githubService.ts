import "dotenv/config";
import { Octokit } from "@octokit/rest";

function getClient() {
  if (!process.env.GITHUB_TOKEN) throw new Error("GITHUB_TOKEN missing in .env");
  return new Octokit({ auth: process.env.GITHUB_TOKEN });
}

export async function getRepoFile(owner: string, repo: string, path: string, ref?: string) {
  const octokit = getClient();
  const res = await octokit.repos.getContent({ owner, repo, path, ref });
  const data: any = res.data;
  if (!data.content) throw new Error("Path is not a file or content unavailable");
  return Buffer.from(data.content, "base64").toString("utf-8");
}

export async function listRepoFiles(owner: string, repo: string, path = "", ref?: string): Promise<string[]> {
  const octokit = getClient();
  const res = await octokit.repos.getContent({ owner, repo, path, ref });
  const data: any = res.data;
  if (!Array.isArray(data)) return [path];
  const files: string[] = [];
  for (const item of data) {
    if (item.type === "file") files.push(item.path);
    if (item.type === "dir" && !["node_modules", ".git", "dist", "build"].includes(item.name)) {
      const child = await listRepoFiles(owner, repo, item.path, ref);
      files.push(...child);
    }
  }
  return files.slice(0, 200);
}
