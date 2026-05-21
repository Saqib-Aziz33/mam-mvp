"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [brief, setBrief] = useState({ topic: "", campaign_goal: "", brand_voice: "", target_audience: "", keywords: "", additional_context: "" });
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [loadingFile, setLoadingFile] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setRunning(true);
    setResult(null);
    setSelectedFile(null);
    const payload = {
      brief: {
        topic: brief.topic,
        campaign_goal: brief.campaign_goal,
        brand_voice: brief.brand_voice,
        target_audience: brief.target_audience,
        keywords: brief.keywords ? brief.keywords.split(',').map(s=>s.trim()) : [],
        additional_context: brief.additional_context
      }
    };

    try {
      const res = await fetch('/api/run', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      setResult(data);
      if (data.run_id) {
        setSelectedFile(null);
      }
    } catch (err) {
      setResult({ error: String(err) });
    } finally {
      setRunning(false);
    }
  }

  async function loadSample() {
    try {
      const res = await fetch('/sample_brief.json');
      const data = await res.json();
      setBrief({
        topic: data.topic || '',
        campaign_goal: data.campaign_goal || '',
        brand_voice: data.brand_voice || '',
        target_audience: data.target_audience || '',
        keywords: Array.isArray(data.keywords) ? data.keywords.join(', ') : (data.keywords || ''),
        additional_context: data.additional_context || ''
      });
    } catch (e) {
      console.error('Failed to load sample brief', e);
      alert('Failed to load sample brief');
    }
  }

  async function loadFile(filename: string) {
    if (!result?.run_id) return;
    setLoadingFile(true);
    try {
      const res = await fetch(`/api/files?run=${result.run_id}&file=${filename}`);
      if (!res.ok) throw new Error(`Failed to load ${filename}`);
      const text = await res.text();
      setFileContent(text);
      setSelectedFile(filename);
    } catch (e) {
      console.error('Failed to load file', e);
      setFileContent(`Failed to load file: ${String(e)}`);
      setSelectedFile(filename);
    } finally {
      setLoadingFile(false);
    }
  }

  const knownFiles = ['brief.json', 'research.json', 'blog_draft.json', 'blog.md', 'seo.json', 'seo_blog.md', 'social.json', 'social.md', 'email.json', 'email.md', 'final_package.json', 'run.log'];

  const renderContent = () => {
    if (loadingFile) return <p className="text-gray-500 text-sm">Loading file...</p>;
    if (!selectedFile) return <p className="text-gray-500 text-sm">Select a file to view</p>;

    const ext = selectedFile.split('.').pop();

    if (ext === 'json') {
      try {
        const json = JSON.parse(fileContent);
        return (
          <pre className="text-xs overflow-auto bg-gray-100 p-3 rounded whitespace-pre-wrap break-words">
            {JSON.stringify(json, null, 2)}
          </pre>
        );
      } catch {
        return <pre className="text-xs overflow-auto whitespace-pre-wrap">{fileContent}</pre>;
      }
    }

    if (ext === 'md') {
      return (
        <div className="text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded border border-gray-200 font-mono text-xs">
          {fileContent}
        </div>
      );
    }

    return <pre className="text-xs overflow-auto whitespace-pre-wrap">{fileContent}</pre>;
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-zinc-50 p-8">
      <main className="w-full max-w-5xl bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-semibold mb-4">Multi-Agent Marketing (Web)</h1>
        <div className="flex gap-2 mb-4">
          <button className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300" onClick={loadSample}>Load sample brief</button>
        </div>
        <form onSubmit={submit} className="space-y-4 mb-6 pb-6 border-b">
          <div>
            <label className="block text-sm font-medium">Topic</label>
            <input className="mt-1 w-full border rounded p-2 text-sm" value={brief.topic} onChange={e=>setBrief({...brief, topic: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium">Campaign Goal</label>
            <input className="mt-1 w-full border rounded p-2 text-sm" value={brief.campaign_goal} onChange={e=>setBrief({...brief, campaign_goal: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Brand Voice</label>
              <input className="mt-1 w-full border rounded p-2 text-sm" value={brief.brand_voice} onChange={e=>setBrief({...brief, brand_voice: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium">Target Audience</label>
              <input className="mt-1 w-full border rounded p-2 text-sm" value={brief.target_audience} onChange={e=>setBrief({...brief, target_audience: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Keywords (comma separated)</label>
            <input className="mt-1 w-full border rounded p-2 text-sm" value={brief.keywords} onChange={e=>setBrief({...brief, keywords: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium">Additional Context</label>
            <textarea className="mt-1 w-full border rounded p-2 text-sm" rows={3} value={brief.additional_context} onChange={e=>setBrief({...brief, additional_context: e.target.value})} />
          </div>
          <div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700" type="submit" disabled={running}>{running ? 'Running workflow...' : 'Run Workflow'}</button>
          </div>
        </form>

        {result && !result.error && result.run_id && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Artifacts (Run ID: {result.run_id})</h2>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {knownFiles.map((file) => (
                <button
                  key={file}
                  onClick={() => loadFile(file)}
                  disabled={loadingFile}
                  className={`px-3 py-2 rounded text-xs font-medium transition ${
                    selectedFile === file
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  } ${loadingFile ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {file}
                </button>
              ))}
            </div>
            <div className="border rounded bg-gray-50 p-4 min-h-64 max-h-96 overflow-auto">
              {renderContent()}
            </div>
          </div>
        )}

        {result?.error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            <strong>Error:</strong> {result.error}
          </div>
        )}
      </main>
    </div>
  );
}


