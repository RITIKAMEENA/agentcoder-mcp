import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Bot, Code2, ShieldCheck, Wand2 } from 'lucide-react';
import './style.css';

const sample = `function twoSum(nums, target) {
  for (let i=0;i<nums.length;i++) {
    for (let j=0;j<nums.length;j++) {
      if (i !== j && nums[i]+nums[j] === target) return [i,j]
    }
  }
}`;

function App() {
  const [tool, setTool] = useState('review_code');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(sample);
  const [output, setOutput] = useState('Click "Run AI Tool" to get real Gemini response.');
  const [loading, setLoading] = useState(false);

  async function runTool() {
    try {
      setLoading(true);
      setOutput('Running AI tool...');

      const response = await fetch('https://agentcoder-mcp-backend.onrender.com/api/run-tool', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tool,
          language,
          code
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      setOutput(data.output);
    } catch (error) {
      setOutput(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app">
      <section className="hero">
        <div>
          <p className="eyebrow">MCP + AI Coding Assistant</p>
          <h1>AgentCoder MCP</h1>
          <p>
            Mini Cursor/Copilot-style assistant for code review, bug fixing,
            optimization, test generation, security checks, GitHub file review,
            and history.
          </p>
        </div>

        <div className="cards">
          <Card icon={<Bot />} title="MCP Tools" text="10+ tools exposed" />
          <Card icon={<ShieldCheck />} title="Security" text="Vulnerability analysis" />
          <Card icon={<Wand2 />} title="LLM" text="Gemini/OpenAI ready" />
        </div>
      </section>

      <section className="workspace">
        <div className="panel">
          <h2>
            <Code2 /> Input
          </h2>

          <label>Tool</label>
          <select value={tool} onChange={(e) => setTool(e.target.value)}>
            <option value="review_code">review_code</option>
            <option value="fix_bug">fix_bug</option>
            <option value="optimize_code">optimize_code</option>
            <option value="generate_tests">generate_tests</option>
            <option value="explain_code">explain_code</option>
            <option value="detect_security_issues">detect_security_issues</option>
          </select>

          <label>Language</label>
          <input value={language} onChange={(e) => setLanguage(e.target.value)} />

          <label>Code</label>
          <textarea value={code} onChange={(e) => setCode(e.target.value)} />

          <button onClick={runTool} disabled={loading}>
            {loading ? 'Running...' : 'Run AI Tool'}
          </button>
        </div>

        <div className="panel">
          <h2>Output</h2>
          <pre>{output}</pre>
        </div>
      </section>
    </main>
  );
}

function Card({ icon, title, text }) {
  return (
    <div className="card">
      {icon}
      <b>{title}</b>
      <span>{text}</span>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);