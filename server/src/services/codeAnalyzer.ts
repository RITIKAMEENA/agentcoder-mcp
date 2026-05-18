export function basicCodeMetrics(code: string) {
  const lines = code.split(/\r?\n/);
  const nonEmptyLines = lines.filter(l => l.trim()).length;
  const commentLines = lines.filter(l => l.trim().startsWith("//") || l.trim().startsWith("#") || l.trim().startsWith("/*") || l.trim().startsWith("*")).length;
  const todoCount = (code.match(/TODO|FIXME/gi) || []).length;
  const nestedLoops = detectNestedLoops(code);
  return { totalLines: lines.length, nonEmptyLines, commentLines, todoCount, nestedLoops };
}

function detectNestedLoops(code: string) {
  const loopRegex = /(for\s*\(|while\s*\(|for\s+.*\s+in\s+|for\s+.*\s+of\s+)/g;
  const matches = code.match(loopRegex) || [];
  return matches.length >= 2 ? "Possible nested/ multiple loops detected" : "No obvious nested loop pattern";
}
