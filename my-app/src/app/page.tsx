"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [brief, setBrief] = useState({ topic: "", campaign_goal: "", brand_voice: "", target_audience: "", keywords: "", additional_context: "" });
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setRunning(true);
    setResult(null);
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

  return (
    <div className="min-h-screen flex items-start justify-center bg-zinc-50 p-8">
      <main className="w-full max-w-3xl bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-semibold mb-4">Multi-Agent Marketing (Web)</h1>
        <div className="flex gap-2 mb-4">
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={loadSample}>Load sample brief</button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Topic</label>
            <input className="mt-1 w-full border rounded p-2" value={brief.topic} onChange={e=>setBrief({...brief, topic: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium">Campaign Goal</label>
            <input className="mt-1 w-full border rounded p-2" value={brief.campaign_goal} onChange={e=>setBrief({...brief, campaign_goal: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium">Brand Voice</label>
            <input className="mt-1 w-full border rounded p-2" value={brief.brand_voice} onChange={e=>setBrief({...brief, brand_voice: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium">Target Audience</label>
            <input className="mt-1 w-full border rounded p-2" value={brief.target_audience} onChange={e=>setBrief({...brief, target_audience: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium">Keywords (comma separated)</label>
            <input className="mt-1 w-full border rounded p-2" value={brief.keywords} onChange={e=>setBrief({...brief, keywords: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium">Additional Context</label>
            <textarea className="mt-1 w-full border rounded p-2" value={brief.additional_context} onChange={e=>setBrief({...brief, additional_context: e.target.value})} />
          </div>
          <div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded" type="submit" disabled={running}>{running ? 'Running...' : 'Run Workflow'}</button>
          </div>
        </form>

        <div className="mt-6">
          <h2 className="text-lg font-medium">Result</h2>
          <pre className="mt-2 bg-gray-100 p-4 rounded max-h-96 overflow-auto">{result ? JSON.stringify(result, null, 2) : 'No result yet'}</pre>
        </div>
      </main>
    </div>
  );
}
